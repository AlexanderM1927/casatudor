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
                    sh 'export JENKINS_NODE_COOKIE=dontKillMe; pm2 start ecosystem.config.cjs'
                }
            }
        }
        stage('Restart db back') {
            tools {
                nodejs 'node-21.11.1'
            }
            steps {
                dir('./strapi') {
                    sh 'npm install'
                    sh 'npm run start'
                }
            }
        }
    }
}
