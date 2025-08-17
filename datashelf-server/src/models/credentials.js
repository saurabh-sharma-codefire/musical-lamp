module.exports = (sequelize, DataTypes) => {
    const credentials = sequelize.define('credentials', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        credType: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        metadata: {
            type: DataTypes.JSON
        },
        isEncrypted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: true,
            },
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, { paranoid: true })

    credentials.associate = function (models) {
        credentials.belongsTo(models.users, {
            foreignKey: "userId",
            as: "user",
        });
        credentials.belongsTo(models.credtypes, {
            foreignKey: "credType",
            as: "credentialType",
        });
    };

    return credentials;
}