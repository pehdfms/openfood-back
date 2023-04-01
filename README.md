* Projeto Desafio Openfood em NestJS

** Instalacao

Após clonar o repositório e instalar o Docker, basta executar os comandos `docker compose up` e `npx mikro-orm migration:up` na pasta principal do projeto.

** Migrations

Para criar a primeira migração:
```
npx mikro-orm migration:create --initial
```

Para criar uma migração depois de atualizar um schema:
```
npx mikro-orm migration:create
```

Para sincronizar novas migrations com o banco:
```
npx mikro-orm migration:up
```


** Devlog
*** Setup Inicial

Para criar a estrutura do projeto, foi utilizado um projeto pessoal com uma estrutura similar, no qual os módulos foram removidos e novos foram regenerados. Essa estrutura inclui uma variedade de bibliotecas úteis para o desenvolvimento, como MikroORM, Pino para logging/tracing, Joi para validação de arquivos de configuração, Class Validator/Transformer, Cron, entre outros.

*** Desenvolvimento

Começou-se com a criação dos health checks (endpoint GET /) seguindo a metodologia TDD (Red, Green, Refactor), utilizando a biblioteca Terminus do NestJS para verificar o status do banco e futuramente acessar outros provedores com mais facilidade.

Após a criação dos health checks, foi desenvolvido o CRUD de produto. Para atender aos testes de saúde, foi necessário ativar o MikroORM, que depende de pelo menos uma entidade funcional para funcionar. A primeira etapa foi adicionar a estrutura básica da entidade Product para que os testes passassem, e posteriormente foram adicionados os demais campos da entidade.

O CRUD foi desenvolvido conforme especificado no desafio, com anotações do Swagger e manipulação de repositórios do MikroORM integrados ao PostgreSQL.

Em seguida, foi criado o módulo de busca de produtos por índice do OpenFood, inicialmente com a lógica escrita em um serviço dentro do módulo products, mas posteriormente separada em três serviços e um controlador em um módulo separado de sincronização.

O design seguido consistiu em um serviço responsável pela I/O de arquivos, para salvar e ler de forma genérica, um serviço responsável pelo download de arquivos e sincronização com o índice, que também é responsável por persistir o progresso pelo índice no banco de dados, e um serviço específico de produtos que coordena ambos para uso na busca de produtos.

Por fim, foi realizada a melhoria da documentação do Swagger e ajustado o UpdateProductDTO, que havia sido deixado por último devido à complexidade de encontrar exemplos e anotar os constraints esperados.
