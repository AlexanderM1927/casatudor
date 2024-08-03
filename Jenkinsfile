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
                    sh 'nuxt build'
                }
            }
        }
        stage('Deploy nuxt') {
            tools {
                nodejs 'node-21.11.1'
            }
            steps {
                dir('./nuxt') {
                    sh 'export JENKINS_NODE_COOKIE=dontKillMe; pm2 start'
                }
            }
        }
        stage('Backend prepare and build') {
            tools {
                nodejs 'node-21.11.1'
            }
            steps {
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
                    sh 'export JENKINS_NODE_COOKIE=dontKillMe; NODE_ENV=production npm run start'
                }
            }
        }
    }
}
