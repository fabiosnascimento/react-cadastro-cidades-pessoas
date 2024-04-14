import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react";

import { Box, Grid, LinearProgress, Paper, Typography } from "@mui/material";

import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";
import { PessoasService } from "../../shared/services/api/pessoas/PessoasService";
import { VTextField, VForm, useVForm } from "../../shared/forms";

interface IFormData {
  email: string;
  cidadeId: number;
  nomeCompleto: string
}

export const DetalheDePessoas: React.FC = () => {
  const { id = 'nova' } = useParams<'id'>();
  const navigate = useNavigate();
  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');

  useEffect(() => {
    if (id !== 'nova') {
      setIsLoading(true);
      PessoasService.getById(Number(id))
        .then((result) => {
          setIsLoading(false);
          if (result instanceof Error) {
            alert(result.message);
            navigate('/pessoas');
          } else {
            setNome(result.nomeCompleto);
            formRef.current?.setData(result);
          }
        });
    } else {
      formRef.current?.setData({
        nomeCompleto: '',
        cidadeId: '',
        email: ''
      })
    }
  }, [id]);

  const handleSave = (dados: IFormData) => {
    setIsLoading(true);
    
    if (id === 'nova') {
      PessoasService.create(dados)
        .then((result) => {
          setIsLoading(false);
          
          if (result instanceof Error) {
            alert(result.message)
          } else {
            if (isSaveAndClose()) {
              navigate('/pessoas');
            } else {
              navigate(`/pessoas/detalhe/${result}`);
            }
          }
        });
    } else {
      PessoasService.updateById(Number(id), {id: Number(id), ...dados})
        .then((result) => {
          setIsLoading(false);
          
          if (result instanceof Error) {
            alert(result.message)
          } else {
            if (isSaveAndClose()) {
              navigate('/pessoas');
            }
          }
        });
    }

  }

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
      PessoasService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Registro apagado com sucesso!');
            navigate('/pessoas');
          }
        });
    }
  }

  return (
    <LayoutBaseDePagina 
      titulo={id === 'nova' ? 'Nova pessoa' : nome}
      barraDeFerramentas={
        <FerramentasDeDetalhe 
          textoBotaoNovo="Nova"
          mostrarBotaoSalvarEFechar
          mostrarBotaoApagar={id !== 'nova'}
          mostrarBotaoNovo={id !== 'nova'}

          aoClicarEmSalvar={save}
          aoClicarEmSalvarEFechar={saveAndClose}
          aoClicarEmApagar={() => {handleDelete(Number(id))}}
          aoClicarEmVoltar={() => navigate('/pessoas')}
          aoClicarEmNovo={() => navigate('/pessoas/detalhe/nova')}
        />
      }
    >

      <VForm ref={formRef} onSubmit={handleSave} placeholder={undefined}>
        
        <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">

          <Grid container direction="column" padding={2} spacing={2}>

            {isLoading && (
              <Grid item>
                <LinearProgress variant="indeterminate" />
              </Grid>
            )}

            <Grid item>
              <Typography variant="h6">Geral</Typography>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth 
                  label="Nome completo"
                  name="nomeCompleto"
                  disabled={isLoading}
                  onChange={e => setNome(e.target.value)}
                />
              </Grid>
            </Grid>
            
            <Grid container item direction="row">
              <Grid container item direction="row" spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                  <VTextField
                    fullWidth 
                    label="Email"
                    name="email"
                    disabled={isLoading}
                  />
                </Grid>
              </Grid>
            </Grid>
            
            <Grid container item direction="row">
              <Grid container item direction="row" spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                  <VTextField
                    fullWidth 
                    label="Cidade"
                    name="cidadeId"
                    disabled={isLoading}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

        </Box>

      </VForm>

    </LayoutBaseDePagina>
  )
}