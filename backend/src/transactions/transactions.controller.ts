import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";

@Controller("transactions")
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post("transfer")
  async transfer(
    @Request() req,
    @Body()
    body: {
      fromAccountId: string;
      toAccountId: string;
      amount: number;
      currency: string;
    }
  ) {
    return this.transactionsService.transfer(
      body.fromAccountId,
      body.toAccountId,
      body.amount,
      body.currency
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post("exchange")
  async exchange(
    @Request() req,
    @Body() body: { fromCurrency: string; toCurrency: string; amount: number }
  ) {
    return this.transactionsService.exchange(
      req.user.sub,
      body.fromCurrency,
      body.toCurrency,
      body.amount
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTransactions(
    @Request() req,
    @Query("type") type: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10
  ) {
    return this.transactionsService.getTransactions(
      req.user.sub,
      type,
      page,
      limit
    );
  }
}
