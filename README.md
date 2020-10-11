# SolAr SNT ☀️

SNT - сервис для создания инструмента взаимодействия между членами некоторой группы (акцент делается на совместную оплату счетов, опросы и объявления)

## Установка и запуск

```
git clone https://github.com/Solar-2020/solar_frontent_2020.git

cd solar_frontent_2020

npm run build && npm run start
```

## В случае проблем

```
npm run fix-err-start
```
Если это не помогло и ошибка: ENOSPC: System limit for number of file watchers
```
cat /proc/sys/fs/inotify/max_user_watches

sudo sysctl fs.inotify.max_user_watches=524288
sudo sysctl -p
```

## Сделано с помощью

* React

## Авторы

* [Веинский Владимир](https://github.com/BarniBl)
* [Кочнов Андрей](https://github.com/tamerlanchik)
* [Шишова Анастасия](https://github.com/NellinLin)
