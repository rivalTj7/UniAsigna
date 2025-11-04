import { db } from '../src/lib/db';
import { expendios } from '../src/lib/db/schema';

const expendiosIniciales = [
  { archivo: '4', nombrePropietario: 'ANNA CONCEPCIÓN PETRONE STORMONT', ubicacion: 'ENTRE LOS EDIFICIOS T-1 Y T-2', tipo: 'KIOSKO' },
  { archivo: '46', nombrePropietario: 'HECTOR BARRERA LOPEZ', ubicacion: 'EFPEM', tipo: 'KIOSKO' },
  { archivo: '51', nombrePropietario: 'MARIA SALOME CAP PABLO', ubicacion: 'ASADITOS FRENTE T-4 E IGLU', tipo: 'KIOSKO' },
  { archivo: '52', nombrePropietario: 'MÓNICA MARLEN CARAVANTES ARAGÓN', ubicacion: 'EFPEM', tipo: 'KIOSKO' },
  { archivo: '53', nombrePropietario: 'CARLOS SUBUYUJ', ubicacion: 'ATRAS DE T-10', tipo: 'KIOSKO' },
  { archivo: '57', nombrePropietario: 'LUIS CHAVEZ', ubicacion: 'COSTADO IGLU', tipo: 'KIOSKO' },
  { archivo: '62', nombrePropietario: 'COMDALSA JORGE MARIO CONTRERAS', ubicacion: 'AL MACARONE FRENTE T-4', tipo: 'KIOSKO' },
  { archivo: '75', nombrePropietario: 'OTTO ESCOBEDO', ubicacion: 'FRENTE IGLU', tipo: 'KIOSKO' },
  { archivo: '79', nombrePropietario: 'CARLOS HAROLDO ESTRADA', ubicacion: 'ATRAS DE T-8 PARQUEO', tipo: 'KIOSKO' },
  { archivo: '80', nombrePropietario: 'MANUEL FIGUEROA', ubicacion: 'TACO USAC FRENTE T-4 E IGLU', tipo: 'KIOSKO' },
  { archivo: '89', nombrePropietario: 'ELEN IVANNIA GONZALEZ', ubicacion: 'LADO NORTE EDIFICIO S-12', tipo: 'KIOSKO' },
  { archivo: '90', nombrePropietario: 'SANTOS JULIANA GUINEA AJPOP DE MORALES', ubicacion: 'PARTE POSTERIOR DEL M-6', tipo: 'KIOSKO' },
  { archivo: '95', nombrePropietario: 'ZOILA HERNANDEZ', ubicacion: 'PIMIENTOS FRENTE S-11', tipo: 'KIOSKO' },
  { archivo: '97', nombrePropietario: 'INVERSIONES LOS FUNDOS S.A. FRENTE EDIFICIO S-12', ubicacion: 'FRENTE S-12 GITANO', tipo: 'KIOSKO' },
  { archivo: '104', nombrePropietario: 'EDGAR JUAREZ', ubicacion: 'FRENTE POLIDEPORTIVO', tipo: 'KIOSKO' },
  { archivo: '112', nombrePropietario: 'IRIS LOPEZ', ubicacion: 'FRENTE IGLU DELISANO', tipo: 'KIOSKO' },
  { archivo: '121', nombrePropietario: 'MARIELA MARTINEZ SOSA', ubicacion: 'ENTRE T-2 Y T-3', tipo: 'KIOSKO' },
  { archivo: '122', nombrePropietario: 'RICARDO MATEO RAMON', ubicacion: 'FRENTE S-1', tipo: 'KIOSKO' },
  { archivo: '134', nombrePropietario: 'GREICI MARLENI PAREDES VELIZ', ubicacion: 'FRENTE AL EDIFICIO S-12', tipo: 'KIOSKO' },
  { archivo: '158', nombrePropietario: 'SHAULLY REYES', ubicacion: 'S-12', tipo: 'KIOSKO' },
  { archivo: '147', nombrePropietario: 'RAFAEL PUAC', ubicacion: 'DETRAS DE CAJA CENTRAL', tipo: 'KIOSKO' },
  { archivo: '148', nombrePropietario: 'ANA SOFIA PUAC', ubicacion: 'FRENTE S-1', tipo: 'KIOSKO' },
  { archivo: '154', nombrePropietario: 'JUAN DOMINGO RAMOS', ubicacion: 'ENTRE T-2 Y T3', tipo: 'KIOSKO' },
  { archivo: '160', nombrePropietario: 'MARCO RODRIGUEZ', ubicacion: 'FRENTE IGLU', tipo: 'KIOSKO' },
  { archivo: '162', nombrePropietario: 'JUAN PABLO RUIZ / MIRIAM ARREAGA', ubicacion: 'FRENTE IGLU', tipo: 'KIOSKO' },
  { archivo: '145', nombrePropietario: 'ELIAS HUMBERTO PUAC CALDERON', ubicacion: 'ENFRENTE DEL EDIFICIO T-3', tipo: 'KIOSKO' },
  { archivo: '227', nombrePropietario: 'ARTURO ANZUETO', ubicacion: 'FRENTE AL S-6', tipo: 'KIOSKO' },
  { archivo: null, nombrePropietario: 'EDUARDO LARIOS', ubicacion: 'ATRAS DE S-2', tipo: 'KIOSKO' },
  { archivo: '66 B', nombrePropietario: 'XENY MARIBEL DE LEÒN MEJÌA', ubicacion: 'LADO NORTE S-12', tipo: 'KIOSKO' },
  { archivo: 'SRB', nombrePropietario: 'SERGIO RENE BARILLAS', ubicacion: 'FRENTE A CALUSAC ANTIGUO', tipo: 'KIOSKO' },
  { archivo: '97', nombrePropietario: 'MARCO TULIO LEMUS/NEVA S.A S.A. FRENTE EDIFICIO M-3', ubicacion: 'FRENTEM-3 GITANO', tipo: 'KIOSKO' },
];

async function seed() {
  console.log('🌱 Iniciando seed de la base de datos...');
  
  try {
    // Insertar expendios
    console.log('📦 Insertando expendios...');
    for (const expendio of expendiosIniciales) {
      await db.insert(expendios).values(expendio);
    }
    
    console.log('✅ Seed completado exitosamente!');
    console.log(`📊 Se insertaron ${expendiosIniciales.length} expendios`);
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
