* Migrations

Para criar a primeira migration:
```
npx mikro-orm migration create --initial
```

Para criar uma migration depois de atualizar um schema:
```
npx mikro-orm migration create
```

Para sincronizar novas migrations com o banco:
```
npx mikro-orm migration up
```


* Devlog
** Setup inicial
Para criar a estrutura do projeto, reutilizei um projeto pessoal com uma estrutura similar, deletei os modulos e regenerei novos.
Essa estrutura inclui uma variedade de bibliotecas uteis para o desenvolvimento, como MikroORM, pino para Logging / Tracing, Joi para validacao de arquivos de configuracao, class validator / transformer, cron, entre outros
