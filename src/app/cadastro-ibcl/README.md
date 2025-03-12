# Cadastro IBCL

Este é o formulário de cadastro para membros da IBCL.

## Funcionalidades

- Cadastro de membros com informações pessoais
- Upload de fotos (pessoal e família)
- Informações sobre tipo de membro, estado civil, grupos e ministérios
- Confirmação visual após o cadastro

## Campos do Formulário

- Nome Completo
- Nome do Pai
- Nome da Mãe
- Endereço Completo
- Contato
- Contato Alternativo
- Data de Nascimento
- Tipo de Membro (Batizado, Aclamado, Carta, Visitante)
- Estado Civil (Solteiro, Viúvo, Casado, Divorciado)
- Data de Casamento (apenas para estado civil "Casado")
- Grupo (GCO ou GA)
- Ministérios
- Foto Pessoal
- Foto da Família

## Tecnologias Utilizadas

- Next.js
- React Hook Form
- Zod para validação
- Supabase para armazenamento de imagens
- Prisma para acesso ao banco de dados

## Banco de Dados

O formulário utiliza o modelo `User` do banco de dados, com os seguintes campos adicionais:

- `membershipType`: Tipo de membro (Batizado, Aclamado, Carta, Visitante)
- `civilStatus`: Estado civil (Solteiro, Viúvo, Casado, Divorciado)
- `engagementDate`: Data de casamento
- `group`: Grupo (GCO ou GA)
- `ministries`: Ministérios
- `photo`: Foto pessoal (substituindo o campo `teenPhoto` do formulário original)

## Migrações

Antes de usar este formulário, é necessário executar as migrações do banco de dados:

1. Execute a primeira migração para adicionar os novos campos:
   ```bash
   psql "$DIRECT_URL" -f prisma/migrations/20240720_update_user_model.sql
   npx prisma generate
   ```

2. Após verificar que os dados foram migrados corretamente, execute a segunda migração para remover o campo antigo:
   ```bash
   psql "$DIRECT_URL" -f prisma/migrations/20240721_remove_teenphoto.sql
   npx prisma generate
   ``` 