router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, tipo, telefone, matricula, foto } = req.body;

    const hashed = await bcrypt.hash(senha, 10);

    const novoUsuario = new User({
      nome,
      email,
      senha: hashed,
      tipo,
      telefone,
      matricula,
      foto,
    });

    await novoUsuario.save();

    res.status(201).send('Usuário registrado com sucesso!');
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Erro ao registrar usuário.' });
  }
});
