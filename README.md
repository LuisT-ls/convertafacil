# ConvertaFacil

![ConvertaFacil Logo](./assets/img/favicon/favicon-32x32.png)

ConvertaFacil é uma calculadora de conversão de unidades online, rápida e fácil de usar, que permite converter entre diferentes tipos de unidades como moedas, temperatura, comprimento, peso, volume e área.

🌐 **Demonstração**: [convertafacil.vercel.app](https://convertafacil.vercel.app)

## 🚀 Funcionalidades

- ✅ Conversão entre múltiplas unidades
- 💱 Taxas de câmbio atualizadas via API externa
- 🔄 Interface intuitiva com troca rápida de unidades
- 🌙 Modo escuro/claro
- 📱 Design responsivo para todos os dispositivos
- 📊 Histórico de conversões salvo localmente
- 📋 Exibição de fórmulas de conversão

## 🛠️ Tecnologias

- HTML5
- CSS3 modular
- JavaScript (ES6+)
- API de taxas de câmbio (ExchangeRate-API)
- LocalStorage para armazenamento de dados

## 🧩 Estrutura do Projeto

```
.
├── assets/
│   ├── css/
│   │   ├── main.css
│   │   └── modules/
│   │       ├── base/
│   │       ├── components/
│   │       ├── features/
│   │       ├── layout/
│   │       └── utils/
│   └── img/
│       └── favicon/
├── js/
│   ├── app.js
│   └── modules/
│       ├── converters/
│       │   ├── area.js
│       │   ├── currency.js
│       │   ├── length.js
│       │   ├── temperature.js
│       │   ├── volume.js
│       │   └── weight.js
│       ├── converter.js
│       ├── darkMode.js
│       └── history.js
├── index.html
├── LICENSE
└── README.md
```

## 🔧 Instalação e Uso

1. Clone o repositório:

   ```bash
   git clone https://github.com/LuisT-ls/convertafacil.git
   ```

2. Abra o arquivo `index.html` em seu navegador ou configure um servidor local.

3. Para desenvolvimento, recomendamos usar a extensão Live Server do VS Code.

## 📊 APIs Utilizadas

- [ExchangeRate-API](https://www.exchangerate-api.com/) - API gratuita para taxas de câmbio atualizadas

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- [ExchangeRate-API](https://www.exchangerate-api.com/) por fornecer taxas de câmbio gratuitas
- [Google Fonts](https://fonts.google.com/) pelas fontes
- [Vercel](https://vercel.com/) pela hospedagem gratuita

---

Desenvolvido com ❤️ por [LuisT-ls](https://github.com/LuisT-ls)
