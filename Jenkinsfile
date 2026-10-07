pipeline {
    agent any
    tools {
        nodejs 'NodeJS16'
    }
    stages {
        stage('Git checkout') {
            steps {
                sh "rm -rf *"
                checkout scm
            }
        }
        stage('Dependências globais') {
            steps {
                script {
                    /*
                    Instala o Yarn
                    */
                    sh 'npm install --global yarn'
                    sh 'yarn install'
                }
            }
        }
        stage('Peraparndo Alcance') {
            steps {
                script {
                    dir('packages/alcance') {
                        sh "ls -la"
                        def packageJSON = readJSON file: 'package.json'
                        VERSAO = packageJSON.version
                        echo "VERSÃO ${VERSAO}"
                    }
                    // A opção -a é uma opção recursiva aprimorada, que preserva todos os atributos do arquivo e também preserva links simbólicos.
                    // O . no final do caminho de origem há uma sintaxe cp específica que permite copiar todos os arquivos e pastas, incluindo os ocultos.
                    // sh "rm -rf ./deployAlc"
                    // sh "mkdir deployAlc"
                    // sh "cd deployAlc"
                    // sh "cp -a ./packages/alcance-library/. ."
                    // sh "rm -rf ./packages/alcance-library"
                    // sh "cd ./packages/alcance-library"
                    // // Lista o conteúdo
                    // sh "ls -la"
                    // /* ----- */
                    // def packageJSON = readJSON file: 'package.json'
                    // VERSAO = packageJSON.version
                    // echo "VERSÃO ${VERSAO}"
                }
            }
        }
        stage('Instalando dependências') {
            steps {
                script {
                    dir('packages/alcance') {
                        sh 'npm config set registry https://registry.npmjs.org/'
                        /*
                        Para evitar problemas com certificados de segurança.
                        */
                        sh 'npm config set strict-ssl false'
                        /*
                        rm: remove a pasta node_modules
                        install: instala os pacotes
                        */
                        sh 'rm -rf node_modules/ && yarn install --network-timeout 100000'
                    }
        		}
            }
        }
        stage('Gerando Build') {
            steps {
                script {
                    /*
                     rm: remove as pastas dist, utils e loader
                     build: gera a build
                     */
                     dir('packages/alcance') {
                        sh 'rm -rf dist/ utils/ loader/ && yarn build'
                     }
        		}
            }
        }
        stage('Publicando no Nexus - NPM') {
            steps {
                script {
                    dir('packages/alcance') {
                        sh 'npm config set registry https://hub.camara.gov.br/repository/npm-hosted/'
                        sh 'npm publish'
                    }
                }
            }
        }
        stage('Peraparndo Alcance-Vue-Library') {
            steps {
                script {
                    // A opção -a é uma opção recursiva aprimorada, que preserva todos os atributos do arquivo e também preserva links simbólicos.
                    // O . no final do caminho de origem há uma sintaxe cp específica que permite copiar todos os arquivos e pastas, incluindo os ocultos.
                    // sh "cd .."
                    // // Lista o conteúdo
                    // sh "ls -la"
                    // // Vai para a pasta 
                    // sh "cd ./packages/vue-library"
                    dir('packages/alcance-vue') {
                        /* ----- */
                        def packageJSON = readJSON file: 'package.json'
                        VERSAO = packageJSON.version
                        echo "VERSÃO ${VERSAO}"
                    }
                }
            }
        }
        stage('Instalando dependências Alcance-Vue-Library') {
            steps {
                script {
                    dir('packages/alcance-vue') {
                        sh 'npm config set registry https://hub.camara.gov.br/repository/npm-camara/'
                        /*
                        Para evitar problemas com certificados de segurança.
                        */
                        sh 'npm config set strict-ssl false'
                        /*
                        rm: remove a pasta node_modules
                        install: instala os pacotes
                        */
                        sh 'rm -rf node_modules/ && yarn install --network-timeout 100000'
                        /*
                        Força atualização do Alcance na Library Vue
                        */
                        sh 'yarn add alcance --network-timeout 100000'
                     }
        		}
            }
        }
        stage('Gerando Build Alcance-Vue-Library') {
            steps {
                script {
                    /*
                     rm: remove as pastas dist, utils e loader
                     build: gera a build
                     */
                     dir('packages/alcance-vue') {
                        sh 'rm -rf lib/ && yarn build'
                     }
        		}
            }
        }
        stage('Publicando no Nexus - NPM - Alcance-Vue-Library') {
            steps {
                script {
                    dir('packages/alcance-vue') {
                        sh 'npm config set registry https://hub.camara.gov.br/repository/npm-hosted/'
                        sh 'npm publish'
                    }
                }
            }
        }
    }
}
