# Avabt de run le docker file, il faut build le projet (npm run build)

# L'image de base qu'on utilise c'est node
FROM node

# L'endroit au les prochaines commandes vont être exécuté
WORKDIR /opensell-frontend

# Copier le dossier build dans l'image
COPY ./build ./build

# Installer serve(permet de run le build)
RUN npm install -g serve

# Run serve sur le port 80 et servir le dossier build
CMD ["serve", "-l", "80", "-s", "build"]