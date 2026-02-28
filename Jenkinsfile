pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        FRONTEND_IMAGE = 'divya080/deployboard-frontend'
        BACKEND_IMAGE  = 'divya080/deployboard-backend'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('frontend') {
                    script {
                        dockerImageFrontend = docker.build("${FRONTEND_IMAGE}:${env.BUILD_NUMBER}")
                    }
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('backend') {
                    script {
                        dockerImageBackend = docker.build("${BACKEND_IMAGE}:${env.BUILD_NUMBER}")
                    }
                }
            }
        }

        stage('Push Images to DockerHub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-creds') {
                        dockerImageFrontend.push("${env.BUILD_NUMBER}")
                        dockerImageFrontend.push('latest')
                        dockerImageBackend.push("${env.BUILD_NUMBER}")
                        dockerImageBackend.push('latest')
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}