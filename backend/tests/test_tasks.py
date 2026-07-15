def test_create_task_success(client):
    res = client.post("/api/tasks", json={"title": "설계 문서 작성"})
    assert res.status_code == 201
    body = res.json()
    assert body["title"] == "설계 문서 작성"
    assert body["status"] == "todo"


def test_create_task_invalid_title(client):
    res = client.post("/api/tasks", json={"title": ""})
    assert res.status_code == 400 or res.status_code == 422


def test_create_task_invalid_due_at(client):
    res = client.post("/api/tasks", json={"title": "테스트", "due_at": "not-a-date"})
    assert res.status_code == 400 or res.status_code == 422


def test_list_tasks_excludes_description(client):
    client.post("/api/tasks", json={"title": "A", "description": "설명"})
    res = client.get("/api/tasks")
    assert res.status_code == 200
    body = res.json()
    assert len(body) == 1
    assert "description" not in body[0]


def test_get_task_includes_description(client):
    created = client.post("/api/tasks", json={"title": "A", "description": "설명"}).json()
    res = client.get(f"/api/tasks/{created['id']}")
    assert res.status_code == 200
    assert res.json()["description"] == "설명"


def test_get_task_not_found(client):
    res = client.get("/api/tasks/does-not-exist")
    assert res.status_code == 404


def test_update_task_success(client):
    created = client.post("/api/tasks", json={"title": "A"}).json()
    res = client.put(f"/api/tasks/{created['id']}", json={"status": "done"})
    assert res.status_code == 200
    assert res.json()["status"] == "done"


def test_update_task_not_found(client):
    res = client.put("/api/tasks/does-not-exist", json={"status": "done"})
    assert res.status_code == 404


def test_delete_task_success(client):
    created = client.post("/api/tasks", json={"title": "A"}).json()
    res = client.delete(f"/api/tasks/{created['id']}")
    assert res.status_code == 204
    assert client.get(f"/api/tasks/{created['id']}").status_code == 404


def test_delete_task_not_found(client):
    res = client.delete("/api/tasks/does-not-exist")
    assert res.status_code == 404
