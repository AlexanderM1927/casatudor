pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    environment {
        NODE_OPTIONS = "--max-old-space-size=768"
        JENKINS_NODE_COOKIE = "dontKillMeCasatudor"
        STRAPI_APP_DIR = "/var/www/apps/casatudor/strapi"
        NUXT_APP_DIR = "/var/www/apps/casatudor/nuxt"
        PERSIST_UPLOADS = "/var/www/uploads/casatudor"
    }

    stages {
        stage('Backend prepare and build') {
            tools {
                nodejs 'node-20.19.5'
            }

            steps {
                withCredentials([file(credentialsId: 'envcasatudor', variable: 'ENV_FILE')]) {
                    sh 'rm -f ./strapi/.env'
                    sh 'cp "$ENV_FILE" ./strapi/.env'
                }

                dir('./strapi') {
                    sh '''
                    set -e

                    echo "[strapi] Installing dependencies..."
                    npm ci

                    echo "[strapi] Building..."
                    NODE_OPTIONS="--max-old-space-size=2048" NODE_ENV=production npm run build
                    '''
                }
            }
        }

        stage('Deploy strapi') {
            tools {
                nodejs 'node-20.19.5'
            }

            steps {
                dir('./strapi') {
                    sh '''
                    set -e

                    echo "[strapi] Deploying to $STRAPI_APP_DIR..."

                    mkdir -p "$STRAPI_APP_DIR"
                    mkdir -p "$PERSIST_UPLOADS"

                    rsync -az --delete \
                    --exclude node_modules \
                    --exclude .cache \
                    --exclude .tmp \
                    --exclude public/uploads \
                    ./ "$STRAPI_APP_DIR/"

                    echo "[strapi] Syncing production dependencies..."
                    rsync -az --delete ./node_modules "$STRAPI_APP_DIR/"

                    cd "$STRAPI_APP_DIR"

                    echo "[strapi] Linking persistent uploads..."
                    rm -rf public/uploads
                    ln -sfn "$PERSIST_UPLOADS" public/uploads
                    ls -ld public/uploads

                    echo "[strapi] Restarting with PM2..."
                    NODE_ENV=production pm2 startOrReload ecosystem.config.js --only CasaTudorStrapi --update-env

                    pm2 save
                    '''
                }
            }
        }

        stage('Frontend prepare and build') {
            tools {
                nodejs 'node-20.19.5'
            }

            steps {
                withCredentials([file(credentialsId: 'envcasatudor-front', variable: 'ENV_FILE')]) {
                    sh 'rm -f ./nuxt/.env'
                    sh 'cp "$ENV_FILE" ./nuxt/.env'
                }

                dir('./nuxt') {
                    sh '''
                    set -e

                    echo "[nuxt] Installing dependencies..."
                    npm ci

                    echo "[nuxt] Building..."
                    npm run build
                    '''
                }
            }
        }

        stage('Deploy nuxt') {
            tools {
                nodejs 'node-20.19.5'
            }

            steps {
                dir('./nuxt') {
                    sh '''
                    set -e

                    echo "[nuxt] Deploying to $NUXT_APP_DIR..."

                    mkdir -p "$NUXT_APP_DIR"

                    rsync -az --delete \
                    .output package.json package-lock.json ecosystem.config.cjs node_modules \
                    "$NUXT_APP_DIR/"

                    cd "$NUXT_APP_DIR"

                    echo "[nuxt] Restarting with PM2..."
                    NODE_ENV=production pm2 startOrReload ecosystem.config.cjs --only CasaTudorNuxt --update-env

                    pm2 save
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            tools {
                nodejs 'node-20.19.5'
            }

            steps {
                sh '''
                set -e

                echo "[verify] PM2 list..."
                pm2 list

                echo "[verify] Checking Nuxt..."
                pm2 list | grep CasaTudorNuxt

                echo "[verify] Checking Strapi..."
                pm2 list | grep CasaTudorStrapi

                echo "[verify] Local HTTP checks..."
                curl -I --max-time 10 http://127.0.0.1:3000 || true
                curl -I --max-time 10 http://127.0.0.1:1337/admin || true
                '''
            }
        }
    }
}
