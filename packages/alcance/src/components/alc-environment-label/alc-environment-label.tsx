import { Component, Host, h, Prop } from '@stencil/core';
import { Environments, EnvType } from './environments'

@Component({
  tag: 'alc-environment-label',
  styleUrl: 'alc-environment-label.css',
  scoped: false,
})
export class AlcEnvironmentLabel {

  /**
   * Define o ambiente da aplicação a ser informado para o usuário.
   */
  @Prop({ reflect: true }) env!: EnvType;

  environments = {
    [Environments.Prototype]:    'Protótipo',
    [Environments.Development]:  'Desenvolvimento',
    [Environments.Testing]:      'Teste',
    [Environments.Homologation]: 'Homologação',
    [Environments.Production]:   '', // É válido (reconhecido), mas não deve ter texto apresentado.
  };

  render() {
    return (
      <Host
        class={{
          'alc-environment-label--prototype':     this.env === Environments.Prototype,
          'alc-environment-label--development':   this.env === Environments.Development,
          'alc-environment-label--testing':       this.env === Environments.Testing,
          'alc-environment-label--homologation':  this.env === Environments.Homologation,
          'alc-environment-label--production':    this.env === Environments.Production,
        }}
      >
        {this.environments[this.env] ?? 'Não reconhecido'}
      </Host>
    );
  }

}
