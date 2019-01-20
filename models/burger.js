module.exports = (sequelize, type) => {
    return sequelize.define('burgers', {
        id: {
            type: type.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: type.STRING,
            allowNull: false
        },
        isDevoured: {
            type: type.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });
};