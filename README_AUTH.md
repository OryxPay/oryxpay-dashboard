# Sistema de Autenticação - Patrimônio+

Este documento explica como configurar e usar o sistema de autenticação integrado com o backend Laravel.

## Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com a seguinte configuração:

```env
# API Configuration
API_BASE_URL=http://localhost:8080/api
```

Substitua `http://localhost:8080/api` pela URL base da sua API Laravel.

### 2. Estrutura do Backend

O sistema espera que o backend Laravel tenha os seguintes endpoints:

#### Autenticação
- `POST /api/auth/login` - Login do usuário (aceita `remember` opcional)
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/logout` - Logout do usuário
- `GET /api/auth/me` - Obter dados do usuário autenticado

#### Resposta Esperada para Login/Register
```json
{
    "message": "Login realizado com sucesso",
    "user": {
        "id": 1,
        "name": "Nome do Usuário",
        "email": "usuario@email.com",
        "cpf": "12345678901",
        "created_at": "2024-01-01T00:00:00.000000Z",
        "updated_at": "2024-01-01T00:00:00.000000Z"
    },
    "token": "Bearer token aqui"
}
```

## Funcionalidades Implementadas

### 1. Página de Login (`/auth/login`)

- Formulário de login com email, senha e checkbox "Lembrar de mim"
- Validação de campos obrigatórios
- Tratamento de erros de validação do backend
- Feedback visual durante o carregamento
- Redirecionamento automático após login bem-sucedido
- Suporte ao campo `remember` para sessões persistentes

### 2. Página de Registro (`/auth/register`)

- Formulário de registro com nome, email, CPF, senha e confirmação
- Máscara automática para CPF (###.###.###-##)
- Validação de campos obrigatórios
- Tratamento de erros de validação do backend
- Feedback visual durante o carregamento

### 3. Middleware de Autenticação

- Proteção automática de rotas
- Redirecionamento para login se não autenticado
- Redirecionamento para dashboard se já autenticado
- Inicialização automática da autenticação

### 4. Store de Autenticação (Pinia)

- Gerenciamento de estado do usuário
- Armazenamento seguro do token no localStorage
- Tratamento de erros de validação
- Funções para login, registro, logout e verificação de usuário

### 5. Plugin de API

- Configuração automática do token de autorização
- Tratamento de erros 401 (não autorizado)
- Logout automático em caso de token inválido

## Como Usar

### 1. Login

```typescript
import { useAuth } from '@/composables/useAuth';

const { login, loading, error, validationErrors } = useAuth();

const handleLogin = async () => {
    const result = await login({
        email: 'usuario@email.com',
        password: 'senha123',
        remember: true // opcional
    });
    
    if (result.success) {
        // Login bem-sucedido
        console.log('Usuário logado!');
    }
};
```

### 2. Registro

```typescript
import { useAuth } from '@/composables/useAuth';

const { register, loading, error, validationErrors } = useAuth();

const handleRegister = async () => {
    const result = await register({
        name: 'Nome do Usuário',
        email: 'usuario@email.com',
        cpf: '12345678901',
        password: 'senha123',
        password_confirmation: 'senha123'
    });
    
    if (result.success) {
        // Registro bem-sucedido
        console.log('Usuário registrado!');
    }
};
```

### 3. Verificar Autenticação

```typescript
import { useAuth } from '@/composables/useAuth';

const { isAuthenticated, user, loading } = useAuth();

// Verificar se está autenticado
if (isAuthenticated.value) {
    console.log('Usuário autenticado:', user.value);
}
```

### 4. Logout

```typescript
import { useAuth } from '@/composables/useAuth';

const { logout } = useAuth();

const handleLogout = async () => {
    await logout();
    // Usuário será redirecionado automaticamente para /auth/login
};
```

#### Botões de Logout Implementados

O sistema já possui botões de logout funcionais em:

- ✅ **Header** - Menu do usuário (ícone de perfil)
- ✅ **Chat** - Menu de configurações

#### Como Implementar em Outras Páginas

```vue
<template>
    <button @click="handleLogout" class="btn btn-danger">
        <icon-logout class="mr-2" />
        Sair
    </button>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth';

const { logout } = useAuth();

const handleLogout = async () => {
    try {
        await logout();
        // Redirecionamento automático
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
};
</script>
```

## Proteção de Rotas

### Proteger Páginas Individuais

Para proteger uma página específica, adicione o middleware de autenticação:

```typescript
definePageMeta({
    middleware: 'auth'
});
```

### Proteger Todas as Rotas

Para proteger todas as rotas automaticamente, configure no `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
    // ... outras configurações
    routeRules: {
        '/**': { middleware: 'auth' }
    }
});
```

### Comportamento do Middleware

O middleware `auth` faz o seguinte:

1. **Se não estiver logado** e tentar acessar uma rota protegida → redireciona para `/auth/login`
2. **Se estiver logado** e tentar acessar `/auth/login` ou `/auth/register` → redireciona para `/`
3. **Se estiver logado** e acessar uma rota protegida → permite o acesso normalmente

### Páginas Já Protegidas

- ✅ `/` (página inicial) - protegida
- ✅ `/auth/login` - redireciona se já logado
- ✅ `/auth/register` - redireciona se já logado

## Tratamento de Erros

O sistema trata automaticamente:

- Erros de validação do backend (exibidos nos campos)
- Erros gerais (exibidos como mensagem de erro)
- Tokens expirados (logout automático)
- Erros de rede (feedback visual)

## Armazenamento Seguro

- Token JWT armazenado no localStorage
- Dados do usuário em cache local
- Limpeza automática em logout
- Verificação de validade do token

## Processo de Logout

Quando o usuário faz logout, o sistema:

1. **Chama o backend** - Envia requisição para `/api/auth/logout`
2. **Limpa o estado local** - Remove dados do usuário e token
3. **Limpa o localStorage** - Remove `auth_token`, `user` e `remember_me`
4. **Redireciona** - Envia para `/auth/login`
5. **Protege rotas** - Middleware impede acesso a páginas protegidas

## Campo "Lembrar de Mim"

O sistema suporta o campo `remember` que pode ser usado para:

- **Frontend**: Marcar se o usuário quer ser lembrado
- **Backend**: Implementar tokens de longa duração ou refresh tokens
- **Armazenamento**: Salvar preferência no localStorage

### Como Funciona:

1. **No Frontend**: O checkbox "Lembrar de mim" controla o valor do campo `remember`
2. **Na Requisição**: O campo é enviado como `true` ou `false` para o backend
3. **No Backend**: Pode ser usado para gerar tokens com expiração diferente
4. **No Armazenamento**: A preferência é salva localmente para referência futura

### Exemplo de Uso no Backend Laravel:

```php
public function login(Request $request)
{
    $credentials = $request->only(['email', 'password']);
    $remember = $request->boolean('remember', false);
    
    if (Auth::attempt($credentials, $remember)) {
        // Se remember for true, gerar token com expiração maior
        $expiration = $remember ? now()->addDays(30) : now()->addHours(24);
        
        $token = $request->user()->createToken('auth-token', ['*'], $expiration);
        
        return response()->json([
            'user' => $request->user(),
            'token' => $token->plainTextToken,
            'message' => 'Login realizado com sucesso'
        ]);
    }
    
    return response()->json(['message' => 'Credenciais inválidas'], 401);
}
```

## Personalização

### Estilização de Erros

Os erros de validação são exibidos com classes CSS específicas:

```css
.has-error .form-input {
    border-color: #ef4444;
}

.text-danger {
    color: #ef4444;
}
```

### Mensagens de Erro

As mensagens de erro podem ser personalizadas no store de autenticação (`stores/auth.ts`).

## Troubleshooting

### 1. Erro de CORS

Certifique-se de que o backend Laravel está configurado para aceitar requisições do frontend:

```php
// config/cors.php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
```

### 2. Token não sendo enviado

Verifique se o plugin de API está configurado corretamente e se o token está sendo salvo no localStorage.

### 3. Redirecionamentos incorretos

Verifique se as rotas no middleware de autenticação estão corretas para o seu projeto.

## Próximos Passos

1. Implementar refresh token
2. Adicionar autenticação social (Google, Facebook, etc.)
3. Implementar recuperação de senha
4. Adicionar verificação de email
5. Implementar autenticação de dois fatores
