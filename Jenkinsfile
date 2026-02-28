pipeline {
    agent any

    // Define variables we will use throughout the pipeline
    environment {
        // IMPORTANT: Replace 'yourdockerhubusername' with your actual DockerHub username!
        DOCKER_IMAGE = 'udayakanth/task-backend'
        
        // This automatically tags the image with the Jenkins build number (e.g., v1, v2)
        IMAGE_TAG = "v${env.BUILD_NUMBER}"
        
        // This tells Jenkins which credentials to use to log into DockerHub
        // You will need to make sure 'dockerhub-credentials' matches the ID in Jenkins
        DOCKER_CREDS = credentials('dockerhub-credentials')
    }

    stages {
        stage('Build Backend Image') {
            steps {
                // Navigate into the backend folder where the Dockerfile lives
                dir('backend') {
                    echo "Building Docker image ${DOCKER_IMAGE}:${IMAGE_TAG}..."
                    // We tag it twice: once with the build number, and once as 'latest'
                    sh 'docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} -t ${DOCKER_IMAGE}:latest .'
                }
            }
        }

        stage('Push Backend Image to DockerHub') {
            steps {
                echo "Logging into DockerHub..."
                // Log in securely using the Jenkins credentials
                sh 'echo $DOCKER_CREDS_PSW | docker login -u $DOCKER_CREDS_USR --password-stdin'
                
                echo "Pushing images to DockerHub..."
                // Push both tags to DockerHub
                sh 'docker push ${DOCKER_IMAGE}:${IMAGE_TAG}'
                sh 'docker push ${DOCKER_IMAGE}:latest'
            }
        }
    }

    post {
        always {
            echo "Cleaning up credentials..."
            sh 'docker logout'
        }
    }
}