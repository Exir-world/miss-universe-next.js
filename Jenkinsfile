pipeline {
    agent any

    environment {
        DOCKER_REGISTRY_URL = 'docker.exirtu.be'
        IMAGE_NAME = 'missuniverse.ex.pro-next'
        GIT_REPO_URL = 'git@github.com:Exir-world/miss-universe-next.js.git'
        TELEGRAM_CHAT_ID = '-1002585379912'
        TELEGRAM_BOT_TOKEN = '8027466900:AAG6Q_0p6rSeEXtg8e0gDcYJmIJ_R7zBVew'
    }

    stages {
        stage('Cleanup') {
            steps {
                deleteDir()
            }
        }

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

    stage('Build & Push for Each Game') {
        steps {
            script {
                def apps = [
                    [name: 'dubaieid',   gameName: 'Dubaieid',   referralUrl: 'https://t.me/dubaieid_ex_pro_bot?start='],
                    [name: 'atossa',     gameName: 'Atossa',     referralUrl: 'https://t.me/atossa_ex_pro_bot?start='],
                    [name: 'santa',      gameName: 'Santa',      referralUrl: 'https://t.me/santa_ex_pro_bot?start='],
                    [name: 'mevlana',    gameName: 'Oros',       referralUrl: 'https://t.me/mevlana_ex_pro_bot?start='],
                    [name: 'satoshi',    gameName: 'Satoshi',    referralUrl: 'https://t.me/satoshi_ex_pro_bot?start='],
                    [name: 'churchill',  gameName: 'Churchill',  referralUrl: 'https://t.me/churchill_ex_pro_bot?start='],
                    [name: 'tesla',      gameName: 'Tesla',      referralUrl: 'https://t.me/tesla_ex_pro_bot?start=']
                ]
    
                withCredentials([usernamePassword(credentialsId: 'DOCKER_REGISTRY_CREDENTIALS_ID', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin ${DOCKER_REGISTRY_URL}"
                }
    
                for (app in apps) {
                    def tag = "${app.name}-${env.BUILD_NUMBER}"
                    def fullImageName = "${DOCKER_REGISTRY_URL}/${IMAGE_NAME}:${tag}"
    
                    echo "🚀 Building image: ${fullImageName}"
    
                    def builtImage = docker.build(
                        fullImageName,
                        "--build-arg NEXT_PUBLIC_BASE_URL=https://token.ex.pro/api " +
                        "--build-arg NEXT_PUBLIC_GAME_NAME=${app.gameName} " +
                        "--build-arg NEXT_GAME_NAME=${app.gameName} " +
                        "--build-arg NEXT_REFERRAL_URL=${app.referralUrl} " +
                        "-f Dockerfile ."
                    )
    
                    docker.withRegistry("https://${DOCKER_REGISTRY_URL}", 'DOCKER_REGISTRY_CREDENTIALS_ID') {
                        builtImage.push()
                        echo "✅ Pushed: ${fullImageName}"
                    }
    
                    // Optional: Remove local image after push to avoid clutter
                    sh "docker rmi ${fullImageName} || true"
                }
    
                // Cleanup any dangling images left behind
                sh "docker image prune -f"
            }
        }
    }


        stage('Cleanup Old Docker Images') {
            steps {
                script {
                    sh """
                    docker images --format '{{.Repository}}:{{.Tag}} {{.CreatedAt}}' \\
                        | grep ${IMAGE_NAME} \\
                        | sort -k2 -r \\
                        | awk 'NR>10 {print \$1}' \\
                        | xargs -r docker rmi
                    """
                }
            }
        }
    }

    post {
        success {
            script {
                def message = "✅ *Frontend builds completed!*\n" +
                              "Built and pushed multi-app images for `${IMAGE_NAME}` at `${env.BUILD_NUMBER}`"

                sh """
                curl -s -X POST https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage \\
                    -d chat_id=${env.TELEGRAM_CHAT_ID} \\
                    -d text="${message}" \\
                    -d parse_mode=Markdown
                """
            }
        }

        failure {
            script {
                def message = "❌ *Pipeline failed!*\n" +
                              "Image: `${IMAGE_NAME}`\n" +
                              "Build: `${env.BUILD_NUMBER}`"

                sh """
                curl -s -X POST https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage \\
                    -d chat_id=${env.TELEGRAM_CHAT_ID} \\
                    -d text="${message}" \\
                    -d parse_mode=Markdown
                """
            }
        }
    }
}
