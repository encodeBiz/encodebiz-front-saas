'use client'
import React  from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
  Divider,
  Chip,
  Button
} from '@mui/material';
import {
  Security,
  PrivacyTip,
  Cookie,
  DataUsage,
  Share,
  Delete,
  Edit,
  Visibility
} from '@mui/icons-material';
 
const PoliticaPrivacidad = () => {
  const fechaActualizacion = '1 de Enero, 2024';

   

  return (
    <>
      

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Chip 
            icon={<Security />} 
            label="Política de Privacidad" 
            color="primary" 
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Política de Privacidad
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Última actualización: {fechaActualizacion}
          </Typography>
        </Box>

        <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
          {/* Introducción */}
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              Introducción
            </Typography>
            <Typography variant="body1" paragraph>
              En <strong>Mi Empresa</strong>, valoramos y respetamos su privacidad. Esta política 
              describe cómo recopilamos, usamos y protegemos su información personal cuando 
              utiliza nuestros servicios.
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Información que recopilamos */}
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              <PrivacyTip sx={{ verticalAlign: 'middle', mr: 1 }} />
              Información que Recopilamos
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <Edit color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Información Personal" 
                  secondary="Nombre, dirección de email, número de teléfono cuando se registra en nuestro servicio." 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <DataUsage color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Datos de Uso" 
                  secondary="Información sobre cómo interactúa con nuestro sitio web y servicios." 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Cookie color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Cookies y Tecnologías Similares" 
                  secondary="Utilizamos cookies para mejorar su experiencia y analizar el tráfico del sitio." 
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Uso de la información */}
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              Cómo Utilizamos su Información
            </Typography>
            
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" paragraph>
                Proporcionar y mantener nuestros servicios
              </Typography>
              <Typography component="li" paragraph>
                Personalizar su experiencia de usuario
              </Typography>
              <Typography component="li" paragraph>
                Comunicarnos con usted sobre actualizaciones y ofertas
              </Typography>
              <Typography component="li" paragraph>
                Mejorar la seguridad y prevenir fraudes
              </Typography>
              <Typography component="li" paragraph>
                Cumplir con obligaciones legales
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Compartición de información */}
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              <Share sx={{ verticalAlign: 'middle', mr: 1 }} />
              Compartición de Información
            </Typography>
            
            <Typography variant="body1" paragraph>
              No vendemos, comerciamos ni transferimos su información personal a terceros, 
              excepto en las siguientes circunstancias:
            </Typography>
            
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" paragraph>
                <strong>Proveedores de servicios:</strong> Empresas que nos ayudan a operar nuestro negocio
              </Typography>
              <Typography component="li" paragraph>
                <strong>Requisitos legales:</strong> Cuando sea necesario por ley o proceso legal
              </Typography>
              <Typography component="li" paragraph>
                <strong>Protección de derechos:</strong> Para proteger nuestros derechos y seguridad
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Derechos del usuario */}
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              <Visibility sx={{ verticalAlign: 'middle', mr: 1 }} />
              Sus Derechos
            </Typography>
            
            <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={2}>
              <Paper sx={{ p: 2, textAlign: 'center' }} variant="outlined">
                <Typography variant="h6" gutterBottom>
                  Acceso
                </Typography>
                <Typography variant="body2">
                  Derecho a acceder a sus datos personales
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 2, textAlign: 'center' }} variant="outlined">
                <Typography variant="h6" gutterBottom>
                  Rectificación
                </Typography>
                <Typography variant="body2">
                  Derecho a corregir datos inexactos
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 2, textAlign: 'center' }} variant="outlined">
                <Typography variant="h6" gutterBottom>
                  <Delete sx={{ verticalAlign: 'middle' }} />
                  Eliminación
                </Typography>
                <Typography variant="body2">
                  Derecho a eliminar sus datos personales
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 2, textAlign: 'center' }} variant="outlined">
                <Typography variant="h6" gutterBottom>
                  Portabilidad
                </Typography>
                <Typography variant="body2">
                  Derecho a transferir sus datos
                </Typography>
              </Paper>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Seguridad */}
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              Seguridad de los Datos
            </Typography>
            
            <Typography variant="body1" paragraph>
              Implementamos medidas de seguridad técnicas y organizativas apropiadas para 
              proteger su información personal contra acceso no autorizado, alteración, 
              divulgación o destrucción.
            </Typography>
            
            <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
              <Chip label="Encriptación SSL" variant="outlined" />
              <Chip label="Acceso Restringido" variant="outlined" />
              <Chip label="Auditorías Regulares" variant="outlined" />
              <Chip label="Backups Seguros" variant="outlined" />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Cookies */}
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              <Cookie sx={{ verticalAlign: 'middle', mr: 1 }} />
              Política de Cookies
            </Typography>
            
            <Typography variant="body1" paragraph>
              Utilizamos diferentes tipos de cookies:
            </Typography>
            
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" paragraph>
                <strong>Esenciales:</strong> Necesarias para el funcionamiento del sitio
              </Typography>
              <Typography component="li" paragraph>
                <strong>Analíticas:</strong> Nos ayudan a entender cómo los usuarios interactúan con el sitio
              </Typography>
              <Typography component="li" paragraph>
                <strong>Funcionales:</strong> Recuerdan sus preferencias y configuraciones
              </Typography>
              <Typography component="li" paragraph>
                <strong>Publicitarias:</strong> Muestran anuncios relevantes para usted
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Cambios en la política */}
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              Cambios en esta Política
            </Typography>
            
            <Typography variant="body1" paragraph>
              Podemos actualizar esta política de privacidad periódicamente. Le notificaremos 
              sobre cambios significativos publicando la nueva política en este sitio y 
              actualizando la fecha de Última actualización.
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Contacto */}
          <Box textAlign="center">
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              Contacto
            </Typography>
            
            <Typography variant="body1" paragraph>
              Si tiene preguntas sobre esta política de privacidad, contáctenos:
            </Typography>
            
            <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap" mt={3}>
              <Button 
                variant="contained" 
                color="primary"
                href="mailto:privacidad@miempresa.com"
              >
                Email: privacidad@miempresa.com
              </Button>
              
              <Button 
                variant="outlined" 
                color="primary"
                href="/contacto"
              >
                Formulario de Contacto
              </Button>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
              <strong>Dirección:</strong> Calle Ejemplo 123, Ciudad, País
              <br />
              <strong>Teléfono:</strong> +1 (555) 123-4567
            </Typography>
          </Box>
        </Paper>

        {/* Footer */}
        <Box textAlign="center" mt={4}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Mi Empresa. Todos los derechos reservados.
            <br />
            <Link href="/terminos-servicio" color="inherit">
              Términos de Servicio
            </Link>
            {' | '}
            <Link href="/politica-cookies" color="inherit">
              Política de Cookies
            </Link>
          </Typography>
        </Box>
      </Container>
    </>
  );
};



export default function PoliticaPrivacidadPage() {
  return (<PoliticaPrivacidad />);
}

 