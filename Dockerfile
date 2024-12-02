FROM node
#Definimos una imagen base: Node. Esto lo toma de Docker Hub. 

WORKDIR /app
#Acá estamos creando una carpeta interna donde guardar nuestro proyecto. 

COPY package.json . 
#Aca estamos copiando el package.json a mi nueva carpeta

RUN npm install 
#instala las dependencias en la nueva carpeta

COPY . . 
#Esto copia todo el codigo de mi aplicación. 

EXPOSE 8080
#Le decimos en que puerto vamos a escuchar. 

CMD [ "npm", "start" ]
#Tiene que ejecutar npm