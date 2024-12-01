import asyncio
import sys
import orjson
from aiohttp import ClientSession
from myskoda import MySkoda
from myskoda.models.info import Info
from myskoda.models.health import Health
from myskoda.models.driving_range import DrivingRange

# Basic info to show (use info or vehicle): 
# - Type of car
# - Vehicle status
# - Driving Range
# - Vehicle image
#
# Check:
# - If VehicleStatus = VehicleStatus.ACTIVATED
#
# TODO:
# - Exception handling - disconnect & close session even after exception
#
# More advanced info:
# - Position
# - Service events
# - Status - doors
# - Trip Statistics
async def main(email, password, vin):

    # Entering try block to aviod not closing session when any exception happens
    try:
        #Create session and connect
        session = ClientSession()
        myskoda = MySkoda(session)
        await myskoda.connect(email, password)

        # Get all needed data
        info: Info = await myskoda.get_info(vin)
        health: Health = await myskoda.get_health(vin)
        driving_range: DrivingRange = await myskoda.get_driving_range(vin)

        #Decode nested objects into JSON
        infoJSON = orjson.dumps(info).decode()
        healthJSON = orjson.dumps(health).decode()
        drivingRangeJSON = orjson.dumps(driving_range).decode()

        #Deserialize to Python dictionaries
        infoDict = orjson.loads(infoJSON)
        healthDict = orjson.loads(healthJSON)
        drivingRangeDict = orjson.loads(drivingRangeJSON)

        #Merge the dictionaries
        mySkodaDict = {**infoDict, **healthDict, **drivingRangeDict}

        #Serialize the merged dictionary back to a JSON string
        mySkodaJSON = orjson.dumps(mySkodaDict).decode()
    finally:
        #Closing connection
        await myskoda.disconnect()
        await session.close()

        #Data returning to JS
        print(mySkodaJSON)
        sys.stdout.flush()

#Invoking the main function in CLI style
asyncio.run(main(sys.argv[1], sys.argv[2], sys.argv[3]))