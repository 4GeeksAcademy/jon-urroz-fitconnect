import requests


def test_health():
    resp = requests.get('http://localhost:3001/api/health')
    assert resp.status_code == 200
    data = resp.json()
    assert data['status'] == 'ok'
    assert data['database'] == 'ok'


def test_register_and_login():
    # Cambia el email para evitar duplicados en cada test
    import random
    email = f"testuser{random.randint(1000, 9999)}@test.com"
    password = "testpass123"
    # Registro
    reg_resp = requests.post('http://localhost:3001/api/register', json={
        'email': email,
        'password': password,
        'role': 'user'
    })
    assert reg_resp.status_code == 201
    # Login
    login_resp = requests.post('http://localhost:3001/api/login', json={
        'email': email,
        'password': password
    })
    assert login_resp.status_code == 200
    data = login_resp.json()
    assert 'token' in data
