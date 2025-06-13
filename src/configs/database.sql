CREATE TABLE IF NOT EXISTS Pizzas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE NOT NULL,
    importe FLOAT NOT NULL,
    descripcion VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Ingredientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE NOT NULL,
    descripcion VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS PizzasIngredientes (
    idPizza INT,
    idIngrediente INT,
    PRIMARY KEY (idPizza, idIngrediente),
    FOREIGN KEY (idPizza) REFERENCES Pizzas(id),
    FOREIGN KEY (idIngrediente) REFERENCES Ingredientes(id)
);

-- Insert data into Pizzas table
INSERT INTO Pizzas (nombre, importe, descripcion) VALUES
('Margherita', 10.99, 'Classic Margherita pizza'),
('Pepperoni', 12.99, 'Pepperoni pizza with extra cheese'),
('Vegetarian', 11.99, 'Vegetarian pizza with mixed vegetables'),
('Hawaiian', 13.99, 'Hawaiian pizza with pineapple and ham');

-- Insert data into Ingredientes table
INSERT INTO Ingredientes (nombre, descripcion) VALUES
('Tomato Sauce', 'Base tomato sauce for pizzas'),
('Mozzarella Cheese', 'Fresh mozzarella cheese'),
('Pepperoni', 'Spicy pepperoni slices'),
('Mushrooms', 'Fresh mushrooms'),
('Onions', 'Sliced onions'),
('Peppers', 'Mixed bell peppers'),
('Pineapple', 'Sweet pineapple chunks'),
('Ham', 'Cooked ham slices');

-- Insert data into PizzasIngredientes table
-- Margherita
INSERT INTO PizzasIngredientes (idPizza, idIngrediente) VALUES
((SELECT id FROM Pizzas WHERE nombre = 'Margherita'), (SELECT id FROM Ingredientes WHERE nombre = 'Tomato Sauce')),
((SELECT id FROM Pizzas WHERE nombre = 'Margherita'), (SELECT id FROM Ingredientes WHERE nombre = 'Mozzarella Cheese'));

-- Pepperoni
INSERT INTO PizzasIngredientes (idPizza, idIngrediente) VALUES
((SELECT id FROM Pizzas WHERE nombre = 'Pepperoni'), (SELECT id FROM Ingredientes WHERE nombre = 'Tomato Sauce')),
((SELECT id FROM Pizzas WHERE nombre = 'Pepperoni'), (SELECT id FROM Ingredientes WHERE nombre = 'Mozzarella Cheese')),
((SELECT id FROM Pizzas WHERE nombre = 'Pepperoni'), (SELECT id FROM Ingredientes WHERE nombre = 'Pepperoni'));

-- Vegetarian
INSERT INTO PizzasIngredientes (idPizza, idIngrediente) VALUES
((SELECT id FROM Pizzas WHERE nombre = 'Vegetarian'), (SELECT id FROM Ingredientes WHERE nombre = 'Tomato Sauce')),
((SELECT id FROM Pizzas WHERE nombre = 'Vegetarian'), (SELECT id FROM Ingredientes WHERE nombre = 'Mozzarella Cheese')),
((SELECT id FROM Pizzas WHERE nombre = 'Vegetarian'), (SELECT id FROM Ingredientes WHERE nombre = 'Mushrooms')),
((SELECT id FROM Pizzas WHERE nombre = 'Vegetarian'), (SELECT id FROM Ingredientes WHERE nombre = 'Onions')),
((SELECT id FROM Pizzas WHERE nombre = 'Vegetarian'), (SELECT id FROM Ingredientes WHERE nombre = 'Peppers'));

-- Hawaiian
INSERT INTO PizzasIngredientes (idPizza, idIngrediente) VALUES
((SELECT id FROM Pizzas WHERE nombre = 'Hawaiian'), (SELECT id FROM Ingredientes WHERE nombre = 'Tomato Sauce')),
((SELECT id FROM Pizzas WHERE nombre = 'Hawaiian'), (SELECT id FROM Ingredientes WHERE nombre = 'Mozzarella Cheese')),
((SELECT id FROM Pizzas WHERE nombre = 'Hawaiian'), (SELECT id FROM Ingredientes WHERE nombre = 'Pineapple')),
((SELECT id FROM Pizzas WHERE nombre = 'Hawaiian'), (SELECT id FROM Ingredientes WHERE nombre = 'Ham'));
