package ui;

import java.time.format.DateTimeFormatter;
import java.time.*;
import java.util.LinkedList;
import java.util.Scanner;

import data.DbProduct;
import entities.Product;

public class Menu {

	Scanner scan = new Scanner(System.in);
	DbProduct db = new DbProduct();

	private String dateFormat="dd/MM/yyyy";
	private String timeFormat="HH:mm:ss";
	private String dateTimeFormat=dateFormat+" "+timeFormat;
	
	public void start() {
		String rta=null;
		
		do {
			rta=inputCommand();
			switch (rta) {
			case "list":
				list();
				break;
			case "search":
				search();
				break;
			case "new":
				newProduct();
				break;
			case "update":
				update();
				break;
			case "delete":
				delete();
				break;
			case "exit":
				close();
				break;
			default:
				System.out.println("Invalid command, try again");
				break;
			}
		} while (!rta.equals("exit"));
		
	}
	
	private void update() {
		Product updPrd = new Product();
		
		System.out.print("Input the id of the product to be modified: ");
		updPrd.setId(Integer.parseInt(scan.nextLine()));
		System.out.println();
		System.out.println("Product's current data:");
		System.out.println(db.search(updPrd));
		System.out.println("Input new data:");
		
		this.loadData(updPrd);
		
		db.update(updPrd);
		
		
	}

	private void delete() {
		Product delPrd = new Product();
		
		System.out.println("Current products:");
		list();
		
		System.out.print("Input the id of the product to be deleted: ");
		delPrd.setId(Integer.parseInt(scan.nextLine()));
		
		db.delete(delPrd);
		
	}

	private void newProduct() {
		
		Product newPrd = new Product();
		
		System.out.println("Insert new product data");
		
		this.loadData(newPrd);
		
		db.newProduct(newPrd);
		
		System.out.println("Autogenerated id is: "+newPrd.getId());
	}

	private void loadData(Product prd) {
		System.out.print("Name: ");
		prd.setName(scan.nextLine());
		
		System.out.print("Description: ");
		prd.setDescription(scan.nextLine());
		
		System.out.print("Price: ");
		prd.setPrice(Double.parseDouble(scan.nextLine()));
		
		System.out.print("Stock: ");
		prd.setStock(Integer.parseInt(scan.nextLine()));
		
		System.out.print("Includes shipping (Y/N): ");
		prd.setShippingIncluded(scan.nextLine().trim().equalsIgnoreCase("Y"));
		
		DateTimeFormatter dtFormat=DateTimeFormatter.ofPattern(dateTimeFormat) ;
		System.out.print("Disabled on :");
		prd.setDisabledOn(LocalDateTime.parse(scan.nextLine(), dtFormat));
		
		DateTimeFormatter dFormat=DateTimeFormatter.ofPattern(dateFormat) ;
		System.out.print("Disabled date :");
		prd.setDisabledDate(LocalDate.parse(scan.nextLine(), dFormat));
		
		DateTimeFormatter tFormat=DateTimeFormatter.ofPattern(timeFormat) ;
		System.out.print("Disabled time :");
		prd.setDisabledTime(LocalTime.parse(scan.nextLine(), tFormat));
		
		System.out.print("Disabled on zoned:");
		prd.setDisabledOnZoned(ZonedDateTime.parse(scan.nextLine(), dtFormat.withZone(ZoneId.of("UTC-3"))));
	}

	private void search() {
		System.out.print("Input search id: ");
		Product searchPrd=new Product();
		searchPrd.setId(Integer.parseInt(scan.nextLine()));
		Product completePrd=db.search(searchPrd);
		if(completePrd==null) {
			System.out.println("404 - Not found");
		} else {
			System.out.println(completePrd);
		}
		
	}
	
	private void list() {
		System.out.println(db.list());
//		LinkedList<Product> prods = db.list();
//		for(Product p:prods) {
//			System.out.println(p);
//		}
	}

	private void close() {
		scan.close();
		System.out.println("Sore ja, mata ne, byebye");
	}

	private String inputCommand() {
		System.out.print("Please input command (list/search/new/update/delete/exit): ");
		return scan.nextLine();
	}
}
