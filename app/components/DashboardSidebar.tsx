import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { 
  Home, 
  UserCircle, 
  Building, 
  FileText, 
  MessageSquare, 
  CreditCard,
  LogOut,
  DollarSign
} from 'lucide-react';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  // Verificar se o link está ativo
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  return (
    <aside className="w-64 bg-blue-800 text-white h-screen fixed top-0 left-0 overflow-y-auto">
      <div className="p-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <img src="/logo-light.svg" alt="Permutem" className="h-8" />
          <span className="text-xl font-bold">Permutem</span>
        </Link>
      </div>
      
      <nav className="mt-6 px-4">
        <ul className="space-y-2">
          <li>
            <Link 
              href="/dashboard" 
              className={`flex items-center space-x-2 p-2 rounded-md hover:bg-blue-700 transition-colors ${isActive('/dashboard') && !isActive('/dashboard/mensagens') && !isActive('/dashboard/propostas') ? 'bg-blue-700' : ''}`}
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          </li>
          
          <li>
            <Link 
              href="/perfil" 
              className={`flex items-center space-x-2 p-2 rounded-md hover:bg-blue-700 transition-colors ${isActive('/perfil') ? 'bg-blue-700' : ''}`}
            >
              <UserCircle className="h-5 w-5" />
              <span>Meu Perfil</span>
            </Link>
          </li>
          
          <li>
            <Link 
              href="/dashboard/imoveis" 
              className={`flex items-center space-x-2 p-2 rounded-md hover:bg-blue-700 transition-colors ${isActive('/dashboard/imoveis') ? 'bg-blue-700' : ''}`}
            >
              <Building className="h-5 w-5" />
              <span>Meus Imóveis</span>
            </Link>
          </li>
          
          <li>
            <Link 
              href="/dashboard/propostas" 
              className={`flex items-center space-x-2 p-2 rounded-md hover:bg-blue-700 transition-colors ${isActive('/dashboard/propostas') ? 'bg-blue-700' : ''}`}
            >
              <FileText className="h-5 w-5" />
              <span>Propostas</span>
            </Link>
          </li>
          
          <li>
            <Link 
              href="/dashboard/mensagens" 
              className={`flex items-center space-x-2 p-2 rounded-md hover:bg-blue-700 transition-colors ${isActive('/dashboard/mensagens') ? 'bg-blue-700' : ''}`}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Mensagens</span>
            </Link>
          </li>
          
          <li>
            <Link 
              href="/dashboard/assinatura" 
              className={`flex items-center space-x-2 p-2 rounded-md hover:bg-blue-700 transition-colors ${isActive('/dashboard/assinatura') ? 'bg-blue-700' : ''}`}
            >
              <CreditCard className="h-5 w-5" />
              <span>Minha Assinatura</span>
            </Link>
          </li>
          
          <li>
            <Link 
              href="/dashboard/historico-pagamentos" 
              className={`flex items-center space-x-2 p-2 rounded-md hover:bg-blue-700 transition-colors ${isActive('/dashboard/historico-pagamentos') ? 'bg-blue-700' : ''}`}
            >
              <DollarSign className="h-5 w-5" />
              <span>Histórico de Pagamentos</span>
            </Link>
          </li>
          
          <li className="mt-6">
            <button
                              onClick={signOut}
              className="flex w-full items-center space-x-2 p-2 rounded-md hover:bg-red-700 transition-colors text-white"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
} 