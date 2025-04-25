'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { getPaymentHistory, getPlanName, Payment } from '@/app/lib/checkout';
import { FileText, Download, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Adaptador para converter o tipo Payment do checkout para o formato que usamos na UI
interface UIPayment {
  id: string;
  usuarioId: string;
  planoId: string;
  valor: number;
  data: string;
  status: 'aprovado' | 'recusado' | 'pendente';
  transactionId: string;
  tipo: 'assinatura' | 'upgrade' | 'downgrade';
}

export default function HistoricoPagamentosPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<UIPayment[]>([]);
  
  useEffect(() => {
    // Redirecionar para login se não estiver autenticado
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    
    const fetchPaymentHistory = async () => {
      if (!user) return;
      
      try {
        // Obter histórico de pagamentos
        const history = await getPaymentHistory(user.id);
        
        // Converter o formato dos pagamentos para o formato da UI
        const uiPayments: UIPayment[] = history.map(payment => ({
          id: payment.id,
          usuarioId: user.id,
          planoId: payment.subscriptionId,
          valor: payment.amount,
          data: payment.date,
          status: mapPaymentStatus(payment.status),
          transactionId: payment.id,
          tipo: detectPaymentType(payment.description)
        }));
        
        setPayments(uiPayments);
      } catch (error) {
        console.error('Erro ao obter histórico de pagamentos:', error);
        toast.error('Não foi possível carregar seu histórico de pagamentos.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaymentHistory();
  }, [isAuthenticated, isLoading, user, router]);
  
  // Função auxiliar para mapear status do pagamento do sistema para a UI
  const mapPaymentStatus = (status: string): 'aprovado' | 'recusado' | 'pendente' => {
    switch (status) {
      case 'paid': return 'aprovado';
      case 'refunded': return 'recusado';
      case 'failed': return 'recusado';
      default: return 'pendente';
    }
  };
  
  // Função auxiliar para detectar o tipo de pagamento com base na descrição
  const detectPaymentType = (description: string): 'assinatura' | 'upgrade' | 'downgrade' => {
    if (description.includes('Upgrade')) return 'upgrade';
    if (description.includes('Downgrade')) return 'downgrade';
    return 'assinatura';
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    });
  };
  
  const getPaymentTypeLabel = (tipo: string) => {
    switch (tipo) {
      case 'assinatura':
        return 'Assinatura';
      case 'upgrade':
        return 'Upgrade de Plano';
      case 'downgrade':
        return 'Downgrade de Plano';
      default:
        return 'Pagamento';
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aprovado':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Aprovado
          </span>
        );
      case 'recusado':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Recusado
          </span>
        );
      case 'pendente':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <CreditCard className="w-3 h-3 mr-1" />
            Pendente
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Desconhecido
          </span>
        );
    }
  };
  
  const handleDownloadReceipt = (paymentId: string) => {
    // Simulação de download de recibo
    toast.success('Recibo enviado para seu e-mail!');
  };
  
  if (loading || isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Histórico de Pagamentos</h1>
        <p className="text-gray-600">Confira todos os seus pagamentos realizados na plataforma.</p>
      </div>
      
      {payments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="flex flex-col items-center justify-center py-10">
            <FileText className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum pagamento encontrado</h3>
            <p className="text-gray-500 max-w-md">
              Você ainda não realizou nenhum pagamento em nossa plataforma. 
              Quando você realizar um pagamento, ele aparecerá aqui.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transação
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plano
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recibo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.data)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getPaymentTypeLabel(payment.tipo)}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {payment.transactionId.slice(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getPlanName(payment.planoId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(payment.valor)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.status === 'aprovado' && (
                        <button
                          onClick={() => handleDownloadReceipt(payment.id)}
                          className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Recibo
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <CreditCard className="h-5 w-5 text-blue-600" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Informações de pagamento</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Todos os pagamentos são processados de forma segura. Se tiver dúvidas sobre alguma 
                cobrança, entre em contato com nosso suporte através do e-mail:
                {' '}<a href="mailto:suporte@permutem.com" className="font-medium underline">suporte@permutem.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 