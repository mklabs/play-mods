package controllers;

import java.lang.reflect.Field;
import java.util.List;

import play.Logger;
import play.db.Model;

public class CrudJson extends CRUD {

	/**
	 * Controller method for UI Grid, based on
	 * {@link CRUD#list(int, String, String, String, String)} with unused
	 * request parameters.
	 */
	public static void listJson(int page, String search, String searchFields, String orderBy, String order) {
		ObjectType type = ObjectType.get(getControllerClass());
		
		notFoundIfNull(type);
		
		if (page < 1) {
			page = 1;
		}
		
		final List<Model> objects = type.findPage(
			page, 
			search, 
			searchFields, 
			orderBy, 
			order, 
			(String) request.args.get("where")
		);
		
		renderJSON(objects);
	}
}