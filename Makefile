install:
		npm i;
		node database/ini.js;
run:
		npm run dev;

reset-database:
		node database/drop.js;