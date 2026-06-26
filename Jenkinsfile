// Pipeline CI/CD Jenkins — reproduit en automatique les étapes décrites dans le README.
pipeline {
  agent any

  environment {
    IMAGE          = 'educentre/tasklist-backend'
    SONAR_HOST_URL = 'https://sonarqube.cicd.kits.ext.educentre.fr'
  }

  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
        sh 'npx prisma generate'
      }
    }

    stage('Tests + Coverage') {
      steps {
        sh 'npx prisma generate --schema=prisma/schema-test.prisma'
        sh 'npm run test:coverage'
        sh 'npm run test:e2e:coverage'
      }
      post {
        always {
          junit 'reports/*.xml'
        }
      }
    }

    stage('SonarQube') {
      steps {
        withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
          sh 'sonar-scanner -Dsonar.host.url=$SONAR_HOST_URL -Dsonar.token=$SONAR_TOKEN'
        }
      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 5, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }

    stage('Build image') {
      steps {
        sh 'docker buildx build --tag $IMAGE:$GIT_COMMIT --load .'
      }
    }

    stage('Trivy scan (CRITICAL,HIGH)') {
      steps {
        sh 'trivy image --severity CRITICAL,HIGH --exit-code 1 $IMAGE:$GIT_COMMIT'
      }
    }

    stage('SBOM') {
      steps {
        sh 'trivy image --format spdx-json     --output sbom-spdx.json       $IMAGE:$GIT_COMMIT'
        sh 'trivy image --format cyclonedx     --output sbom-cyclonedx.json  $IMAGE:$GIT_COMMIT'
        archiveArtifacts artifacts: 'sbom-*.json', fingerprint: true
      }
    }

    stage('Push DockerHub') {
      when { branch 'main' }
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub',
                                          usernameVariable: 'DH_USER',
                                          passwordVariable: 'DH_PASS')]) {
          sh 'echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin'
          sh 'docker buildx build --platform linux/amd64 --tag $IMAGE:latest --sbom=true --provenance=true --push .'
        }
      }
    }
  }
}
