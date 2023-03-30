INSERT INTO department (name)
VALUES ("Sales"),
        ("Engineering");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1),
        ("Salesperson", 80000, 1),
        ("Lead Engineer", 150000, 2),
        ("Engineer", 120000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, NULL),
        ("Ky", "Nguyen", 2, 1),
        ("Josh", "Ly", 3, NULL),
        ("Jack", "Garnica", 4, 3);