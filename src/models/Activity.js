const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define("Activity", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false, // no lo pide
        },
        duration: {
            type: DataTypes.INTEGER,
        },
        difficulty: {
            type: DataTypes.INTEGER,
                validate: {
                min: 1,
                max: 5,
            },
        allowNull: false, // no lo pide
        },
        season: {
            type: DataTypes.ENUM(
                "Summer",
                "Winter",
                "Spring",
                "Autumn",
                "All the year" // no lo pide
        ),
        defaultValue: "All the year"
        },
    });
};

/*
- [ ] Actividad Turística con las siguientes propiedades:
- ID
- Nombre
- Dificultad (Entre 1 y 5)
- Duración
- Temporada (Verano, Otoño, Invierno o Primavera)
*/