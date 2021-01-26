# SolAr Pay-together ☀️

Pay-together - сервис для взаимодействия между участниками группы, основной целью которой является совместная оплата товаров и услуг.

## Какую проблему решает
Упрощает взаимодействие организатора со всеми членами группы, делает наглядными расходы членов группы в статистике, упрощает отслеживание оплаты взносов и необходимых платежей.

## Архитектура
Проект является веб-приложением.
Фронтенд написан на Java Script с использованием фреймворка React.
Бекенд написан на Golang, включает в себя 6 микросервисов, в качестве базы данных используется PostgreSQL, а для проксирования запросов используется Nginx.
Из особенностей можно выделить взаимодействие с внешними сервисами: YooMoney, Yandex авторизация и Mail SMTP. Также стоит упомянуть, что в ходе разработки было задействовано два окружения: тестовый и продакшн; для удобства разработки настроен полноценный CI/CD.

## Демонстрация
В данный момент сайт не доступен к песещению из-за технических проблем.
Ознакомиться с проектом и увидеть его в демонстрации можно с помощью видео, которое доступно по [ссылочке](https://drive.google.com/file/d/17_EdKm_oNU6PSPWpmr68jwhuAkpl22AH/view?usp=sharing).

## Установка и запуск

```
git clone https://github.com/Solar-2020/solar_frontent_2020.git

cd solar_frontent_2020

npm i

npm run build && npm run start
```

## В случае проблем

```
sudo npm run build && sudo npm run start
```
Или же
```
npm run fix-err-start
```
Если это не помогло и ошибка: ENOSPC: System limit for number of file watchers
```
cat /proc/sys/fs/inotify/max_user_watches

sudo sysctl fs.inotify.max_user_watches=524288
sudo sysctl -p
```

## Frontend сделан с помощью

* React

## Авторы

* [Веинский Владимир](https://github.com/BarniBl)
* [Кочнов Андрей](https://github.com/tamerlanchik)
* [Шишова Анастасия](https://github.com/NellinLin)
