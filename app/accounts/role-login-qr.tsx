import TourPageContent from '../../src/features/role-login-qr/RoleQrManagementScreen';
import { TourTarget } from '@/src/features/app-tour';
export default function TourPage() {
  return <TourTarget id="screen.accounts-role-login-qr.overview" style={{ flex: 1 }}><TourTarget id="screen.accounts-role-login-qr.workspace" style={{ flex: 1 }}><TourPageContent /></TourTarget></TourTarget>;
}
