# Backend Symfony

Pour exécuter les tests unitaires (PHPUnit) localement :

1. Installer les dépendances Composer :

```bash
cd backend-symfony
composer install
```

2. Lancer PHPUnit :

```bash
./vendor/bin/phpunit -c phpunit.xml
```

Si `vendor` est manquant, exécute `composer install`.
