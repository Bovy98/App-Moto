package com.riccardo.ws;

import java.io.File;
import java.util.List;

import org.apache.ibatis.session.RowBounds;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.riccardo.importExportFiles.WriteToExcelFile;
import com.riccardo.mapper.MotoMapper;
import com.riccardo.models.Moto;
import com.riccardo.models.MotoExample;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.ResponseBuilder;

@Path("moto")
public class MotoServicesMyBatis {

	private static final Logger logger = LoggerFactory.getLogger(MotoServicesMyBatis.class);

	// GESTIONE DEL 404, 200
	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getById(@PathParam("id") int id) {

		SqlSessionFactory sessionFactory = SqlSessionFactoryManager.getSqlSessionFactory();

		SqlSession session = sessionFactory.openSession();

		try {
			MotoMapper motoMapper = session.getMapper(MotoMapper.class);
			Moto mb = motoMapper.selectByPrimaryKey(id);

			if (mb != null) {
				return Response.status(Response.Status.OK).entity(mb).build();

			} else {
				return Response.status(Response.Status.NOT_FOUND).entity("moto non trovata!").build();
			}
		} finally {
			session.close();
		}

	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	public Response getByExample(@QueryParam("model") String model, @QueryParam("ccFrom") Integer ccFrom,
			@QueryParam("ccTo") Integer ccTo, @QueryParam("yearProdFrom") String yearProdFrom,
			@QueryParam("yearProdTo") String yearProdTo, @QueryParam("priceFrom") Integer priceFrom,
			@QueryParam("priceTo") Integer priceTo, @QueryParam("orderBy") @DefaultValue("anno") String orderBy,
			@QueryParam("orderHow") @DefaultValue("desc") String orderHow, @QueryParam("offset") Integer offset,
			@QueryParam("limit") Integer limit) {

		SqlSessionFactory sessionFactory = SqlSessionFactoryManager.getSqlSessionFactory();
		SqlSession session = sessionFactory.openSession();

		List<Moto> listaMoto = null;

//		RowBounds rowBounds = null;  METODI PER INSERIRE I ROWBOUNDS

//		if (offset!=null && limit!=null) {
//			rowBounds = new RowBounds(offset,limit); 
//		}
//		else if(offset==null && limit==null) {
//			rowBounds = RowBounds.DEFAULT;
//		}

//		if (offset!=null && limit!=null) {
//			rowBounds = new RowBounds(offset,limit); 
//		}
//		else if(offset==null && limit==null) {
//			rowBounds = new RowBounds(RowBounds.NO_ROW_OFFSET, RowBounds.NO_ROW_LIMIT);
//		}

//		Paginazione Server Side
		if (offset == null)
			offset = RowBounds.NO_ROW_OFFSET;
		if (limit == null)
			limit = RowBounds.NO_ROW_LIMIT;
		RowBounds rowBounds = new RowBounds(offset, limit);

		MotoExample mb = new MotoExample();
		MotoExample.Criteria criteria = mb.createCriteria(); // Create a single criteria

		if (model != null) {
			criteria.andModelloLike("%" + model + "%"); // sistemato il like se scrivo solo un pezzetto di queryParam,
														// Modificato metodo andModelloLike con ILIKE
		}
		if (ccFrom != null) {
			criteria.andCcGreaterThan(ccFrom);
			// greaterThan, lessThan
		}
		if (ccTo != null) {
			criteria.andCcLessThan(ccTo);
		}
		if (yearProdFrom != null) {
			criteria.andAnnoGreaterThanOrEqualTo(yearProdFrom);
		}
		if (yearProdTo != null) {
			criteria.andAnnoLessThanOrEqualTo(yearProdTo);
		}
		if (priceFrom != null) {
			criteria.andPrezzoGreaterThanOrEqualTo(priceFrom);
		}
		if (priceTo != null) {
			criteria.andPrezzoLessThanOrEqualTo(priceTo);
		}

		if (orderBy != null && orderHow != null) {
			mb.setOrderByClause(orderBy + " " + orderHow + ", modello " + "asc"); // mi raggruppa i modelli a seconda
																					// della marca
		}

		try {

			MotoMapper motoMapper = session.getMapper(MotoMapper.class);

			listaMoto = motoMapper.selectByExampleWithRowbounds(mb, rowBounds);

			return Response.status(Response.Status.OK).entity(listaMoto).build();

		} finally {
			session.close();
		}
	}

	// GESTIONE DEL 200 OK
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response insert(Moto motoBean) {

		SqlSessionFactory sessionFactory = SqlSessionFactoryManager.getSqlSessionFactory();
		SqlSession session = sessionFactory.openSession();

		MotoMapper motoMapper = session.getMapper(MotoMapper.class);

		try {
			motoMapper.insert(motoBean);
			session.commit();
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return Response.status(Response.Status.CONFLICT).entity("Inserimento moto fallito.").build();
		} finally {
			session.close();
		}
		return Response.status(Response.Status.OK).entity(motoBean).build();
	}

	// GESTIONE DEL 404, 200
	@PUT
	@Path("/{id}")
	public Response updateMoto(@PathParam("id") int id, Moto motoBean) {

		SqlSessionFactory sessionFactory = SqlSessionFactoryManager.getSqlSessionFactory();
		SqlSession session = sessionFactory.openSession();

		MotoMapper motoMapper = session.getMapper(MotoMapper.class);

		try {// Ottieni l'oggetto Moto prima dell'aggiornamento
			Moto modifiedMoto = motoMapper.selectByPrimaryKey(id);

			// se non trovo la moto con la select nel DB
			if (modifiedMoto == null) {
				return Response.status(Response.Status.NOT_FOUND).entity("Moto non trovata!").build();
			}
			// CONTROLLO se la moto esiste gia
			if (modifiedMoto == motoBean) {
				return Response.status(Response.Status.CONFLICT).entity("Moto gia presente nel db.").build();
			}

			// Applica i cambiamenti all'oggetto Moto esistente
			modifiedMoto.setModello(motoBean.getModello());
			modifiedMoto.setCc(motoBean.getCc());
			modifiedMoto.setAnno(motoBean.getAnno());
			modifiedMoto.setPrezzo(motoBean.getPrezzo());

			// Esegui l'operazione di aggiornamento
			int righeModificate = motoMapper.updateByPrimaryKeySelective(modifiedMoto);
			session.commit();
			if (righeModificate > 0) {
				return Response.status(Response.Status.OK).entity(modifiedMoto).build();
			} else {
				return Response.status(Response.Status.NOT_FOUND).entity("Errore durante l'aggiornamento della Moto.")
						.build();
			}

		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return Response.status(Response.Status.CONFLICT).entity("Violazione dei vincoli del db").build();
		}

	}

	// // true -> 200 o false -> 404
	@DELETE
	@Path("/{id}")
	public Response deleteById(@PathParam("id") int id) {
		SqlSessionFactory sessionFactory = SqlSessionFactoryManager.getSqlSessionFactory();
		SqlSession session = sessionFactory.openSession();

		MotoMapper motoMapper = session.getMapper(MotoMapper.class);

		try {
			Moto foundMoto = motoMapper.selectByPrimaryKey(id);

			// CONTROLLO SELECTBYPRIMARYKEY SE E' PRESENTE OPPURE NO
			// se non trovo la moto con la select nel DB
			if (foundMoto == null) {
				return Response.status(Response.Status.NOT_FOUND).entity("Moto non trovata!").build();
			}

			motoMapper.deleteByPrimaryKey(id);
			session.commit();
			return Response.status(Response.Status.OK).build();

		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("internal server error").build();
		}
	}

	@GET
	@Path("/exportMotoToExcel")
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public Response exportMotoToExcel() {

		List<Moto> listaMoto = null;

		try {
			WriteToExcelFile.writeMotoListToFile("WriteMotoToExcel.xls", listaMoto);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("internal server error").build();
		}

		File file = new File("C:\\Users\\ricca\\eclipse-workspace\\RestApiMyBatis\\WriteMotoToExcel.xls");

		ResponseBuilder response = Response.ok((Object) file);
		response.header("Content-Disposition", "attachment; filename=DisplayName-WriteMotoToExcel.xls");
		return response.build();
	}

}