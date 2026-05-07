#!/bin/bash

echo "Adicionando alterações..."
git add .

echo "Digite a mensagem do commit:"
read mensagem

if [ -z "$mensagem" ]; then
  echo "Mensagem não pode ser vazia!"
  exit 1
fi

git commit -m "$mensagem"

echo "Enviando para o GitHub..."
git push

echo "Concluído!"