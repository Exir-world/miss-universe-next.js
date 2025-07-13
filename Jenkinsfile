pipeline {
    agent any

    environment {
        DOCKER_REGISTRY_URL = 'docker.exirtu.be'
        IMAGE_NAME = 'missuniverse.ex.pro-next'
        GIT_REPO_URL = 'git@github.com:Exir-world/miss-universe-next.js.git'
        TELEGRAM_CHAT_ID = '-1002585379912'
        TELEGRAM_BOT_TOKEN = '8027466900:AAG6Q_0p6rSeEXtg8e0gDcYJmIJ_R7zBVew'
    }

    parameters {
        choice(name: 'APP', choices: ['dubaieid', 'missuniverse', 'mevlana', 'santa', 'satoshi', 'churchill', 'tesla'], description: 'Select the app to deploy')
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

        stage('Set Environment Variables') {
            steps {
                script {
                    def envs = [
                        dubaieid:    [GAME_NAME: 'Dubaieid',    BASE_URL: 'https://token.ex.pro/api', REFERRAL_URL: 'https://t.me/dubaieid_ex_pro_bot?start='],
                        missuniverse:[GAME_NAME: 'Atossa',      BASE_URL: 'https://token.ex.pro/api', REFERRAL_URL: 'https://t.me/atossa_ex_pro_bot?start='],
                        mevlana:     [GAME_NAME: 'Oros',        BASE_URL: 'https://token.ex.pro/api', REFERRAL_URL: 'https://t.me/mevlana_ex_pro_bot?start='],
                        santa:       [GAME_NAME: 'Santa',       BASE_URL: 'https://token.ex.pro/api', REFERRAL_URL: 'https://t.me/santa_ex_pro_bot?start='],
                        satoshi:     [GAME_NAME: 'Satoshi',     BASE_URL: 'https://token.ex.pro/api', REFERRAL_URL: 'https://t.me/satoshi_ex_pro_bot?start='],
                        churchill:   [GAME_NAME: 'Churchill',   BASE_URL: 'https://token.ex.pro/api', REFERRAL_URL: 'https://t.me/churchill_ex_pro_bot?start='],
                        tesla:       [GAME_NAME: 'Tesla',       BASE_URL: 'https://token.ex.pro/api', REFERRAL_URL: 'https://t.me/tesla_ex_pro_bot?start=']
                    ]

                    def selected = envs[params.APP]
                    env.NEXT_PUBLIC_GAME_NAME = selected.GAME_NAME
                    env.NEXT_PUBLIC_BASE_URL = selected.BASE_URL
                    env.NEXT_GAME_NAME = selected.GAME_NAME
                    env.NEXT_REFERRAL_URL = selected.REFERRAL_URL
                }
            }
        }

        stage('Get Latest Image Tag') {
            steps {
                script {
                    def tagsJson = sh(
                        script: "curl -s -X GET https://${DOCKER_REGISTRY_URL}/v2/${IMAGE_NAME}/tags/list",
                        returnStdout: true
                    ).trim()

                    def latestTag = "1"
                    try {
                        def tags = readJSON text: tagsJson
                        def numericTags = tags.tags.findAll { it ==~ /^\d+$/ }*.toInteger().sort()
                        if (numericTags) {
                            latestTag = (numericTags[-1] + 1).toString()
                        }
                    } catch (Exception e) {
                        echo "⚠️ Failed to parse tags. Defaulting to tag 1. Error: ${e.message}"
                    }

                    env.IMAGE_TAG = latestTag
                    echo "🚀 Using image tag: ${env.IMAGE_TAG}"
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'rm -rf node_modules package-lock.json'
                sh 'npm cache clean --force'
                sh 'npm install'
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    def customImage = docker.build(
                        "${IMAGE_NAME}:${IMAGE_TAG}",
                        "--build-arg NEXT_PUBLIC_BASE_URL=${env.NEXT_PUBLIC_BASE_URL} " +
                        "--build-arg NEXT_PUBLIC_GAME_NAME=${env.NEXT_PUBLIC_GAME_NAME} " +
                        "--build-arg NEXT_REFERRAL_URL=${env.NEXT_REFERRAL_URL} " +
                        "--build-arg NEXT_GAME_NAME=${env.NEXT_GAME_NAME} " +
                        "-f Dockerfile ."
                    )

                    withCredentials([usernamePassword(credentialsId: 'DOCKER_REGISTRY_CREDENTIALS_ID', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin ${DOCKER_REGISTRY_URL}'
                    }

                    docker.withRegistry("https://${DOCKER_REGISTRY_URL}", 'DOCKER_REGISTRY_CREDENTIALS_ID') {
                        customImage.push()
                        customImage.push("latest")
                    }
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
                        | awk 'NR>4 {print \$1}' \\
                        | xargs -r docker rmi
                    """
                }
            }
        }
    }

    post {
        success {
            script {
                def lastCommitMessage = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                def message = "✅ your container is alive!!!\n" +
                              "App: ${params.APP}\n" +
                              "Commit: ${lastCommitMessage}\n" +
                              "Image: ${env.IMAGE_NAME}:${env.IMAGE_TAG}"

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
                def lastCommitMessage = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                def message = "❌ Pipeline failed!\n" +
                              "App: ${params.APP}\n" +
                              "Commit: ${lastCommitMessage}\n" +
                              "Image: ${env.IMAGE_NAME}:${env.IMAGE_TAG}"

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
