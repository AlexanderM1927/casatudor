pipeline {
    agent any
    options {
        disableConcurrentBuilds()
    }
    stages {
        stage('Frontend prepare and build') {
            tools {
                nodejs 'node-20.19.5'
            }
            steps {
                withCredentials([file(credentialsId: 'envcasatudor-front', variable: 'ENV_FILE')]) {
                    sh 'rm -f ./nuxt/.env'
                    sh 'cp "\$ENV_FILE" ./nuxt/.env'
                }
                dir('./nuxt') {
                    sh 'rm -rf node_modules package-lock.json'
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        stage('Deploy nuxt') {
            tools {
                nodejs 'node-20.19.5'
            }
            steps {
                dir('./nuxt') {
                    sh 'export JENKINS_NODE_COOKIE=dontKillMeCasatudor; pm2 start ecosystem.config.cjs'
                }
            }
        }
        stage('Backend prepare and build') {
            tools {
                nodejs 'node-20.19.5'
            }
            steps {
                withCredentials([file(credentialsId: 'envcasatudor', variable: 'ENV_FILE')]) {
                    sh 'rm -f ./strapi/.env'
                    sh 'cp "\$ENV_FILE" ./strapi/.env'
                }
                dir('./strapi') {
                    sh '''
                      set -e

                      # --- Persistent uploads path outside Jenkins ---
                      PERSIST_UPLOADS="/var/www/uploads/casatudor"

                      # 1) Ensure the external uploads folder exists (adjust sudo if not needed)
                      mkdir -p "$PERSIST_UPLOADS"
                      chown -R "$(whoami)":"$(whoami)" "$PERSIST_UPLOADS"
                      chmod -R 755 "$PERSIST_UPLOADS"

                      # 2) (one-time) migrate any existing local uploads if they were a real folder
                      if [ -d "./public/uploads" ] && [ ! -L "./public/uploads" ] && [ -n "$(ls -A ./public/uploads 2>/dev/null)" ]; then
                        echo "[strapi] Migrating existing ./public/uploads -> $PERSIST_UPLOADS (first run only)..."
                        cp -rn ./public/uploads/* "$PERSIST_UPLOADS"/ 2>/dev/null || true
                      fi

                      # 3) Replace ./public/uploads with a symlink to the persistent folder
                      rm -rf ./public/uploads
                      ln -s "$PERSIST_UPLOADS" ./public/uploads
                      ls -ld ./public/uploads
                    '''
                    sh 'rm -rf node_modules package-lock.json'
                    sh 'npm install'
                    sh 'NODE_ENV=production npm run build'
                }
            }
        }
        stage('Deploy strapi') {
            tools {
                nodejs 'node-20.19.5'
            }
            steps {
                dir('./strapi') {
                    sh 'export JENKINS_NODE_COOKIE=dontKillMeCasatudor; NODE_ENV=production pm2 start'
                }
            }
        }
        stage('Verify Deployment') {
            tools {
                nodejs 'node-20.19.5'
            }
            steps {
                script {
                    sh 'pm2 list | grep CasaTudorNuxt'
                    sh 'pm2 list | grep CasaTudorStrapi'
                }
            }
        }
    }
}
