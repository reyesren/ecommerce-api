const schedule = require("node-schedule");
const Order = require("../models/order");
const fastcsv = require("fast-csv");
const fs = require("fs");
const { convertDateToReadable } = require("../utils/utility");

// script to change order statuses set to run at 8pm every night
const changeOrders = () =>
  schedule.scheduleJob("* * 20 * * *", async () => {
    let currOrder;
    let noMoreOrders = false;
    let firstWrite = true;
    while (!noMoreOrders) {
      currOrder = await Order.findOne({
        status: "placed",
        dateOrderPlaced: convertDateToReadable(new Date()),
      });
      if (!currOrder) {
        noMoreOrders = true;
        firstWrite = false;
      } else {
        let ws;
        const formatFile = {
          orderId: currOrder._id,
          itemId: currOrder.itemId,
          quantity: currOrder.numPurchased,
          addressLine1: currOrder.destination.line1,
          addressLine2: currOrder.destination.line2,
          city: currOrder.destination.city,
          "province/state": currOrder.destination.province,
          "postal/zip": currOrder.destination.postalCode,
          country: currOrder.destination.country,
        };
        let addToFileArr = [];
        currOrder.status = "shipped";
        await currOrder.save();
        addToFileArr.push(formatFile);
        ws = fs.createWriteStream(
          `./scripts/outputFiles/orders-${convertDateToReadable(
            new Date()
          )}.csv`,
          {
            flags: "a",
            header: [
              { id: "orderId", title: "orderId" },
              { id: "itemId", title: "itemId" },
              { id: "quantity", title: "quantity" },
              { id: "addressLine1", title: "addressLine1" },
              { id: "addressLine2", title: "addressLine2" },
              { id: "city", title: "city" },
              { id: "province/state", title: "province/state" },
              { id: "postal/zip", title: "postal/zip" },
              { id: "country", title: "country" },
            ],
          }
        );
        if (firstWrite) {
          fastcsv
            .write(addToFileArr, {
              headers: true,
              includeEndRowDelimiter: true,
            })
            .pipe(ws);
          firstWrite = false;
        } else {
          fastcsv
            .write(addToFileArr, {
              headers: false,
              includeEndRowDelimiter: true,
            })
            .pipe(ws);
        }
      }
    }
    console.log("Finished updating orders!");
  });

module.exports = changeOrders;
