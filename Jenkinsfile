pipeline {
    agent any

    environment {
        // We define ghcr.io to pull the images built by GitHub Actions
        REGISTRY = 'ghcr.io'
        
        // This tells Jenkins which credentials to use to log into GHCR
        // Make sure 'ghcr-credentials' matches the ID in Jenkins Global Credentials
        DOCKER_CREDS = credentials('ghcr-credentials')

        // IMPORTANT: Replace 'org/occ-taskmanagement' with your actual lowercased GitHub repository name
        // E.g., 'udayakanth/occ-taskmanagement'
        REPO = 'adhish-krishna/occ-taskmanagement'
        
        FRONTEND_IMAGE = "${REGISTRY}/${REPO}/frontend:latest"
        BACKEND_IMAGE = "${REGISTRY}/${REPO}/backend:latest"
    }

    stages {
        stage('Login to GHCR') {
            steps {
                echo "Logging into GitHub Container Registry..."
                // Log in securely using the Jenkins credentials
                sh 'echo $DOCKER_CREDS_PSW | docker login ghcr.io -u $DOCKER_CREDS_USR --password-stdin'
            }
        }

        stage('Pull Latest Images') {
            steps {
                echo "Pulling latest images from GHCR..."
                sh "docker pull ${FRONTEND_IMAGE}"
                sh "docker pull ${BACKEND_IMAGE}"
            }
        }

        stage('Deploy Containers') {
            steps {
                echo "Starting new containers..."
                
                // Create a custom docker network if it doesn't exist
                sh "docker network inspect task-net >/dev/null 2>&1 || docker network create task-net"

                // 1. Database: MongoDB
                // Remove old container if it exists
                sh "docker rm -f occ-mongo || true"
                sh """
                docker run -d \\
                  --name occ-mongo \\
                  --network task-net \\
                  -p 27017:27017 \\
                  -v mongo-data:/data/db \\
                  mongo:7
                """

                // 2. Backend API
                sh "docker rm -f occ-backend || true"
                sh """
                docker run -d \\
                  --name occ-backend \\
                  --network task-net \\
                  -p 8000:8000 \\
                  -e MONGO_URI="mongodb://occ-mongo:27017/task_database" \\
                  ${BACKEND_IMAGE}
                """

                // 3. Frontend UI
                sh "docker rm -f occ-frontend || true"
                sh """
                docker run -d \\
                  --name occ-frontend \\
                  --network task-net \\
                  -p 80:80 \\
                  -e REACT_APP_API_URL=http://occ-backend:8000
                  ${FRONTEND_IMAGE}
                """
            }
        }

        stage('Cleanup Unused Images') {
            steps {
                echo "Cleaning up dangling images..."
                // Removes old unused images to save disk space
                sh "docker image prune -af"
            }
        }
    }

    post {
        always {
            echo "Cleaning up local workspace..."
            sh 'docker logout ghcr.io'
            cleanWs()
        }
    }
}