# Processo de revisão de tickets

1. Fazer checkout da branch `tkt-` (número do ticket).
2. Verificar se os requisitos foram atendidos. Corrigir (ou solicitar a correção) se não foram.
3. Verificar possíveis efeitos colaterais, melhorias de código (legibilidade, facilidade de manutenção etc.). Ajustar (ou solicitar o ajuste) se for o caso.
4. Caso a branch `develop` tenha sido modificada depois do início da branch `tkt-`, fazer merge `develop -> tkt`. Isso vai garantir que eventuais problemas (como conflitos) possam ser resolvidos na branch `tkt-`.
5. Se houver conflitos, corrigi-los.
6. Se `develop` trouxe alguma novidade que pode interferir na demanda que está sendo revisada, refazer os passos 2 e 3.
7. Executar todos os testes automatizados, tanto "spec" quanto "e2e". Nenhum teste deve falhar.
8. Gerar build, para ter certeza de que o processo de build não foi prejudicado.
9. Fazer push da branch `tkt-`.
10. Retornar à branch `develop` e fazer merge `tkt -> develop` usando a opção `--no-ff` (no fast foward). Por ex.: `git merge --no-ff tkt-12345`. Essa opção é importante para manter separado no histórico as alterações relacionadas ao ticket.
11. Fazer push da branch `develop`. Isso vai gerar um snapshot (job do Jenkins).
12. Apagar a branch `tkt-` local e remota.


Esse processo é importante para garantir que a branch `tkt-` só seja reincorporada a `develop` quando tiver resolvido adequadamente a demanda associada a ela. Além disso, garantir que o que vá para `develop` passou nos testes e não quebrou o build.

Ter sempre em mente que o push no build significa a publicação de um novo snapshot e atualização do storybook.