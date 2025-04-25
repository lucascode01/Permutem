const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Verifica se o módulo archiver está instalado
try {
  require.resolve('archiver');
} catch (e) {
  console.error('Instalando dependência necessária: archiver...');
  require('child_process').execSync('npm install --no-save archiver');
  console.log('Dependência instalada com sucesso.');
}

// Cria o arquivo de saída
const output = fs.createWriteStream(path.join(__dirname, 'permutem-deploy.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 } // Nível máximo de compressão
});

// Evento de finalização
output.on('close', function() {
  console.log(`📦 Arquivo zip criado com sucesso: ${path.join(__dirname, 'permutem-deploy.zip')}`);
  console.log(`📏 Tamanho total: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
  console.log('✅ Pronto para upload na Vercel!');
});

// Aviso sobre erros
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    console.warn('⚠️ Aviso:', err);
  } else {
    throw err;
  }
});

// Erro
archive.on('error', function(err) {
  throw err;
});

// Pipe do archive para o output
archive.pipe(output);

// Arquivos e diretórios a incluir
const filesToInclude = [
  'app',
  'public',
  'next.config.js',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'tailwind.config.js',
  'postcss.config.js',
  '.next'
];

// Arquivos e diretórios a ignorar
const ignorePatterns = [
  'node_modules',
  '.git',
  '.github',
  '.vscode',
  '.env.local',
  '.env.development',
  '.env'
];

// Função para verificar se um caminho deve ser ignorado
function shouldIgnore(filePath) {
  return ignorePatterns.some(pattern => {
    return filePath.includes(pattern);
  });
}

// Adiciona os arquivos ao zip
filesToInclude.forEach(item => {
  const itemPath = path.join(__dirname, item);
  
  if (!fs.existsSync(itemPath)) {
    console.warn(`⚠️ Aviso: ${item} não encontrado, pulando...`);
    return;
  }
  
  const stats = fs.statSync(itemPath);
  
  if (stats.isDirectory()) {
    // Adiciona diretório, excluindo os ignorados
    archive.directory(itemPath, item, entry => {
      if (shouldIgnore(entry.name)) {
        return false;
      }
      return entry;
    });
    console.log(`📁 Adicionando diretório: ${item}`);
  } else {
    // Adiciona arquivo
    archive.file(itemPath, { name: item });
    console.log(`📄 Adicionando arquivo: ${item}`);
  }
});

// Adiciona um arquivo README.txt com instruções
const readmeContent = `
INSTRUÇÕES PARA DEPLOY NA VERCEL
================================

Este arquivo zip contém todos os arquivos necessários para fazer o deploy do projeto Permutem na Vercel.

Como fazer o deploy:
1. Acesse https://vercel.com e faça login
2. Clique em "New Project"
3. Escolha a opção "Upload" e selecione este arquivo zip
4. Configure o domínio de sua preferência
5. Clique em "Deploy"

Depois do deploy, você pode configurar variáveis de ambiente necessárias, como:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

Para qualquer problema, consulte a documentação da Vercel: https://vercel.com/docs

`;

archive.append(readmeContent, { name: 'README.txt' });
console.log('📄 Adicionando arquivo: README.txt com instruções de deploy');

// Finaliza
archive.finalize(); 