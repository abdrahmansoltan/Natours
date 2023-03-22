const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      withCredentials: true,
      data: {
        email,
        password,
      },
    });

    console.log(res);
  } catch (err) {
    console.log('error', err.response.data.message);
  }
};

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });
    if ((res.data.status = 'success')) location.reload(true);
  } catch (err) {
    console.log(err.response);
    console.log('error', 'Error logging out! Try again.');
  }
};

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
