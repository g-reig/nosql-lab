NOSQL learning lab

Build the images and create the containers:
- docker compose up --build

Remove the containers:
- docker compose down

Remove the data volume (requires removal of the containers first):
- docker volume rm -f nosql_mongo_data