pipeline {
    agent any

    environment {
        REGISTRY = 'ghcr.io'
        REPO = 'adhish-krishna/occ-taskmanagement'
        FRONTEND_IMAGE = "${REGISTRY}/${REPO}/frontend:latest"
        BACKEND_IMAGE = "${REGISTRY}/${REPO}/backend:latest"
    }

    stages {

        stage('Login to GHCR') {
            steps {
                echo "Logging into GitHub Container Registry..."
                withCredentials([usernamePassword(
                    credentialsId: 'ghcr-credentials',
                    usernameVariable: 'GHCR_USER',
                    passwordVariable: 'GHCR_TOKEN'
                )]) {
                    sh '''
                        echo $GHCR_TOKEN | docker login ghcr.io -u $GHCR_USER --password-stdin
                    '''
                }
            }
        }

        stage('Pull Latest Images') {
            steps {
                echo "Pulling latest images from GHCR..."
                sh """
                    docker pull ${FRONTEND_IMAGE}
                    docker pull ${BACKEND_IMAGE}
                """
            }
        }

        stage('Deploy Containers') {
            steps {
                echo "Deploying containers..."

                sh """
                    docker network inspect task-net >/dev/null 2>&1 || docker network create task-net

                    docker rm -f occ-mongo || true
                    docker rm -f occ-backend || true
                    docker rm -f occ-frontend || true
                """

                sh """
                    docker run -d \\
                      --name occ-mongo \\
                      --network task-net \\
                      -p 27017:27017 \\
                      -v mongo-data:/data/db \\
                      mongo:7
                """

                sh """
                    docker run -d \\
                      --name occ-backend \\
                      --network task-net \\
                      -p 8000:8000 \\
                      -e MONGO_URI=mongodb://occ-mongo:27017/task_database \\
                      ${BACKEND_IMAGE}
                """

                sh """
                    docker run -d \\
                      --name occ-frontend \\
                      --network task-net \\
                      -p 80:80 \\
                      ${FRONTEND_IMAGE}
                """
            }
        }

        stage('Cleanup Unused Images') {
            steps {
                echo "Cleaning up unused images..."
                sh "docker image prune -af || true"
            }
        }
    }

    post {
        always {
            echo "Cleaning workspace..."
            cleanWs()
        }
    }
}
