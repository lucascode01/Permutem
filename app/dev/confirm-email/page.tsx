'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ConfirmEmailPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  // Verificar se estamos em ambiente de desenvolvimento
  const isDev = process.env.NODE_ENV === 'development';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Por favor, informe o email');
      return;
    }
    
    try {
      setIsLoading(true);
      setResult(null);
      
      const response = await fetch('/api/dev/confirm-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(data.message);
        setResult(`✅ ${data.message}`);
      } else {
        toast.error(data.error || 'Erro ao confirmar email');
        setResult(`❌ ${data.error || 'Erro ao confirmar email'}`);
      }
    } catch (error) {
      console.error('Erro ao confirmar email:', error);
      toast.error('Erro ao processar solicitação');
      setResult('❌ Erro ao processar solicitação');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isDev) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-xl font-semibold text-red-600 mb-4">Acesso Restrito</h1>
          <p className="text-gray-700">
            Esta página só está disponível em ambiente de desenvolvimento.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-blue-600 mb-4">Confirmação de Email (DEV)</h1>
        <p className="text-red-500 font-medium mb-4">
          ⚠️ Esta ferramenta deve ser usada APENAS em ambiente de desenvolvimento!
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email para confirmar:
            </label>
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@exemplo.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Processando...' : 'Confirmar Email'}
          </button>
        </form>
        
        {result && (
          <div className={`mt-4 p-3 rounded-md ${result.startsWith('✅') ? 'bg-green-50' : 'bg-red-50'}`}>
            {result}
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-600">
          <p>
            Use esta ferramenta para confirmar manualmente um email registrado no Supabase,
            sem precisar acessar a caixa de entrada do usuário.
          </p>
        </div>
      </div>
    </div>
  );
} 