import { NotInterested, CheckOutlined } from "@mui/icons-material"
import { Box } from "@mui/material"

export const checkbizPlansItems = (current: boolean, highlighted: boolean): any => ({
  es: {
    freemium: <ul style={{ paddingInlineStart: 0 }}></ul>,

    bronze: (
      <ul style={{ paddingInlineStart: 0 }}>
        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <Box>
            <strong>Registro y cumplimiento legal</strong>
          </Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>Fichaje con geolocalización (GPS/geocerca) y control biométrico.</Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>Control de horas trabajadas.</Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>Gestión de empleados y sucursales/proyectos.</Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>Asignación de empleados a la sucursal/proyecto disponible.</Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>Configuración de festivos, vacaciones y ausencias programadas.</Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>Sistema de tickets para incidencias, reportes y comunicación directa.</Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>Informes y exportación (CSV).</Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <Box>
            <strong>Análisis y control de rendimiento</strong>
          </Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>Estadísticas y reportes comparativos entre sucursales/proyectos.</Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>Patrones de comportamiento a nivel de empleados y sucursales.</Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>
            Insights basados en métricas heurísticas y patrones actualizados día a día para mejorar el rendimiento y
            detectar costes ocultos.
          </Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>
            <strong>Add-ons:</strong> asistente de IA de operaciones para convertir el comportamiento operativo de tu
            empresa en decisiones accionables y mejores resultados.
          </Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>
            <strong>Soporte estándar:</strong> tiempos de respuesta definidos + ayuda operativa.
          </Box>
        </li>
      </ul>
    ),

    enterprise: (
      <ul style={{ paddingInlineStart: 0 }}>
        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>Todo lo incluido en el plan Bronce.</Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>
            <strong>Soporte completo</strong> (canales preferentes).
          </Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>
            <strong>Integraciones con ERP/CRM y desarrollos a medida</strong> (bajo acuerdo).
          </Box>
        </li>

        {/* <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>
            <strong>Operación escalable para grandes organizaciones multi-entidad</strong>.
          </Box>
        </li> */}

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>Integraciones por webhook.</Box>
        </li>
      </ul>
    ),
  },

  en: {
    freemium: <ul style={{ paddingInlineStart: 0 }}></ul>,

    bronze: (
      <ul style={{ paddingInlineStart: 0 }}>
        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <Box>
            <strong>Time tracking and legal compliance</strong>
          </Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>Clock-in with geolocation (GPS/geofencing) and biometric verification.</Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>Worked-hours tracking.</Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>Employee, branch, and project management.</Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>Assign employees to the available branch/project.</Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>Configure holidays, vacations, and planned absences.</Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>Ticketing system for incidents, reports, and direct communication.</Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>Reports and exports (CSV).</Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <Box>
            <strong>Performance analytics and operational control</strong>
          </Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>Comparative statistics and reports across branches/projects.</Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>Behavior patterns at employee and branch levels.</Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>
            Insights built on heuristic metrics and day-to-day updated patterns to improve performance and identify
            hidden operational costs.
          </Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>
            <strong>Add-ons:</strong> an Operations AI assistant that turns operational behavior into actionable
            decisions for better outcomes.
          </Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>
            <strong>Standard support:</strong> defined response times + operational assistance.
          </Box>
        </li>
      </ul>
    ),

    enterprise: (
      <ul style={{ paddingInlineStart: 0 }}>
        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>Everything included in the Bronze plan.</Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>
            <strong>Full support</strong> (priority channels).
          </Box>
        </li>

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>
            <strong>ERP/CRM integrations and custom development</strong> (by agreement).
          </Box>
        </li>

        {/* <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>
            <strong>Scalable operations for large, multi-entity organizations</strong>.
          </Box>
        </li> */}

        <li style={{ listStyle: "none", marginBottom: 10, display: "flex", gap: 10 }}>
          <CheckOutlined
            fontSize="small"
            sx={{
              color: (theme) =>
                current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main,
              position: "relative",
              top: 5,
            }}
          />
          <Box>Webhook integrations.</Box>
        </li>
      </ul>
    ),
  },
})
