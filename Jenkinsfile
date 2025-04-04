pipeline {
    agent any
    options {
        disableConcurrentBuilds()
    }
    stages {
        stage('Frontend prepare and build') {
            tools {
                nodejs 'node-21.11.1'
            }
            steps {
                withCredentials([file(credentialsId: 'envcasatudor-front', variable: 'ENV_FILE')]) {
                    sh 'rm -f ./nuxt/.env'
                    sh 'cp "\$ENV_FILE" ./nuxt/.env'
                }
                dir('./nuxt') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        stage('Deploy nuxt') {
            tools {
                nodejs 'node-21.11.1'
            }
            steps {
                dir('./nuxt') {
                    sh 'export JENKINS_NODE_COOKIE=dontKillMeCasatudor; pm2 start ecosystem.config.cjs'
                }
            }
        }
        stage('Backend prepare and build') {
            tools {
                nodejs 'node-21.11.1'
            }
            steps {
                withCredentials([file(credentialsId: 'envcasatudor', variable: 'ENV_FILE')]) {
                    sh 'rm -f ./strapi/.env'
                    sh 'cp "\$ENV_FILE" ./strapi/.env'
                }
                dir('./strapi') {
                    sh 'npm install'
                    sh 'NODE_ENV=production npm run build'
                }
            }
        }
        stage('Deploy strapi') {
            tools {
                nodejs 'node-21.11.1'
            }
            steps {
                dir('./strapi') {
                    sh 'export JENKINS_NODE_COOKIE=dontKillMeCasatudor; NODE_ENV=production pm2 start'
                }
            }
        }
    }
}
