INSERT INTO department (name)
VALUES ("Sales"),
        ("Engineering");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1),
        ("Salesperson", 80000, 1),
        ("Lead Engineer", 150000, 2),
        ("Engineer", 120000, 2);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("John", "Doe", 1),
        ("Ky", "Nguyen", 2),
        ("Josh", "Ly", 3),
        ("Jack", "Garnica", 4);